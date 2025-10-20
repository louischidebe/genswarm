// app/api/chat/route.ts

import crypto from "crypto"

// ✅ Authoritative sources
const AUTH_SOURCES = [
  "https://docs.gensyn.ai",
  "https://blog.gensyn.ai",
  "https://gensyn.ai/research",
  "https://gensyn.ai/testnet",
  "https://github.com/gensyn-ai/rl-swarm",
  "https://github.com/gensyn-ai/blockassist",
]

// ✅ Known handles for verified social links
const KNOWN_HANDLES = [
  "https://x.com/gensynai",
  "https://x.com/0xLoui5",
]

// ✅ Helper: fetch plain text from a URL
async function fetchPlainText(url: string) {
  try {
    const r = await fetch(url)
    const html = await r.text()
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 4000)
    return { url, text }
  } catch {
    return { url, text: "" }
  }
}

function containsKnownHandle(contextText: string, handle: string) {
  return contextText.toLowerCase().includes(handle.toLowerCase())
}

// ✅ Lightweight local text ranking (no external API)
function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
}

// Simple term-frequency vector
function termFreq(tokens: string[]) {
  const freq: Record<string, number> = {}
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1
  return freq
}

// Cosine similarity between two frequency maps
function cosineFreq(a: Record<string, number>, b: Record<string, number>) {
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)])
  let dot = 0,
    normA = 0,
    normB = 0
  for (const k of allKeys) {
    const av = a[k] || 0
    const bv = b[k] || 0
    dot += av * bv
    normA += av * av
    normB += bv * bv
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1)
}

// ✅ Rank pages locally by TF-IDF-style similarity
async function buildRankedContext(
  userQuery: string,
  pages: { url: string; text: string }[],
  topN = 3
) {
  const qTokens = tokenize(userQuery)
  const qFreq = termFreq(qTokens)

  const scored = pages.map((p) => {
    const docTokens = tokenize(p.text)
    const docFreq = termFreq(docTokens)
    const score = cosineFreq(qFreq, docFreq)
    return { ...p, score }
  })

  const top = scored.sort((a, b) => b.score - a.score).slice(0, topN)
  return top.map((p) => `SOURCE: ${p.url}\n\n${p.text}`).join("\n\n---\n\n")
}


// ✅ System prompt
const SYSTEM_PROMPT = `
You are **Genswarm**, the helpful and concise assistant for the Gensyn community.

Always answer only using the "SOURCE:" context provided.
Never invent or hallucinate.

When you can answer:
✅ **Answer:**
<concise, factual explanation>

📚 **Sources:**
<list the most relevant URLs>

If the information is not available:
"I couldn’t find that in the verified Gensyn sources. You can check the official [Docs] https://docs.gensyn.ai or [Discord] https://discord.gg/gensyn for updates."

If asked for a social handle:
Use only from provided context or KNOWN_HANDLES; otherwise, use the fallback above.
`

// ✅ Fireworks API call
async function callFireworks(messages: any[]) {
  const apiKey = process.env.FIREWORKS_API_KEY
  const resp = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b",
      max_tokens: 1024,
      temperature: 0.2,
      messages,
    }),
  })
  if (!resp.ok) throw new Error(await resp.text())
  return resp.json()
}

// ✅ Main API route
export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message?.trim()) {
      return Response.json({ error: "No message" }, { status: 400 })
    }

    // Fetch sources
    const pages = await Promise.all(AUTH_SOURCES.map(fetchPlainText))

    // Rank & select top 3 sources
    const context = await buildRankedContext(message, pages, 3)

    const systemMsg = { role: "system", content: SYSTEM_PROMPT }
    const contextMsg = { role: "system", content: `CONTEXT:\n\n${context}` }
    const userMsg = { role: "user", content: message }

    // Query model
    const fireworksResp = await callFireworks([systemMsg, contextMsg, userMsg])
    let reply =
      fireworksResp?.choices?.[0]?.message?.content ||
      fireworksResp?.choices?.[0]?.text ||
      ""

    // Handle socials
    const askHandles = /handle|twitter|x handle|x account|social/i.test(message)
    if (askHandles) {
      const foundHandle = KNOWN_HANDLES.find((h) => reply.includes(h))
      if (!foundHandle) {
        return Response.json({
          reply:
            "I couldn’t find an official social handle in the verified sources. You can follow Gensyn’s updates on [Docs](https://docs.gensyn.ai) or [Discord](https://discord.gg/gensyn).",
          sources: AUTH_SOURCES,
        })
      }
      reply = `✅ **Answer:**  
You can follow Gensyn on X at: ${foundHandle}  
  
📚 **Source:**  
${foundHandle}`
    }

    return Response.json({ reply, sources: AUTH_SOURCES })
  } catch (err: any) {
    console.error("Chat error:", err)
    return Response.json({ error: "Chat failed: " + String(err.message) }, { status: 500 })
  }
}
