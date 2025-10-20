"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { glassStyle } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey there! I'm Genswarm's AI assistant. Ask me anything about Gensyn, the quiz, or the community!",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      })


      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Sorry, I couldn’t get a response.",
      }


      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later or check your connection.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Widget Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <span className="text-2xl">{isOpen ? "✕" : "💬"}</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={glassStyle}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl flex flex-col z-40 h-96"
          >
            {/* Header */}
            <div className="border-b border-accent/20 p-4">
              <h3 className="font-bold text-lg text-white">Ask Genswarm</h3>
              <p className="text-xs text-white/60">Powered by Fireworks AI</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-accent text-primary rounded-br-none"
                        : "rounded-bl-none border border-accent/20"
                    }`}
                    style={message.role === "assistant" ? glassStyle : undefined}
                  >
                    <p className="text-sm text-white"
                      dangerouslySetInnerHTML={{
                        __html: message.content.replace(
                          /(https?:\/\/[^\s]+)/g,
                          '<a href="$1" target="_blank" rel="noopener noreferrer" class="underline text-white hover:text-accent/80">$1</a>'
                        ),
                      }}
                    />

                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div style={glassStyle} className="px-4 py-2 rounded-lg rounded-bl-none border border-accent/20">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-accent animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-accent animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-accent/20 p-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                style={glassStyle}
                className="flex-1 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-accent text-white hover:bg-accent/90 disabled:opacity-50 font-semibold"
              >
                Send
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
