// /app/api/leaderboard/route.ts
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ✅ Fetch leaderboard (GET)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("handle, score, difficulty, created_at")
      .order("score", { ascending: false })
      .limit(10)

    if (error) throw error

    return Response.json({ data })
  } catch (err: any) {
    console.error("Leaderboard fetch error:", err)
    return Response.json(
      { error: "Failed to fetch leaderboard." },
      { status: 500 }
    )
  }
}

// ✅ Submit new score (POST)
// ✅ Submit new score (update if higher)
export async function POST(req: Request) {
  try {
    const { handle, score, difficulty } = await req.json()

    if (!handle || !score || !difficulty) {
      return Response.json({ error: "Missing required fields." }, { status: 400 })
    }

    // ✅ Try to insert, or update if handle+difficulty already exist
    const { data, error } = await supabase
      .from("leaderboard")
      .upsert(
        { handle, score, difficulty },
        { onConflict: "handle,difficulty" }
      )
      .select()

    if (error) throw error

    return Response.json({ data })
  } catch (err: any) {
    console.error("❌ Leaderboard insert/update error:", err)
    return Response.json(
      { error: err.message || "Failed to submit score." },
      { status: 500 }
    )
  }
}


