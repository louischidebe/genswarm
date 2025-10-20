"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { glassStyle } from "@/lib/utils"

interface LeaderboardEntry {
  handle: string
  score: number
  date: string
}

export function LeaderboardTabs() {
  const [activeTab, setActiveTab] = useState<"easy" | "medium" | "hard">("easy")
  const [leaderboard, setLeaderboard] = useState<Record<string, LeaderboardEntry[]>>({
    easy: [],
    medium: [],
    hard: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/leaderboard")
      const json = await res.json()

      if (json.error) throw new Error(json.error)

      // 🔁 Transform Supabase data → UI structure
      const mapped = { easy: [] as LeaderboardEntry[], medium: [], hard: [] }
      for (const row of json.data || []) {
        const diff = row.difficulty as "easy" | "medium" | "hard"
        mapped[diff].push({
          handle: row.handle,
          score: row.score,
          date: new Date(row.created_at).toLocaleDateString(),
        })
      }

      // Sort each difficulty by score (desc)
      Object.keys(mapped).forEach((key) => {
        mapped[key as keyof typeof mapped].sort((a, b) => b.score - a.score)
      })

      setLeaderboard(mapped)
      localStorage.setItem("genswarm_leaderboard", JSON.stringify(mapped))
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
  ] as const

  const currentScores = leaderboard[activeTab] || []

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-accent/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium transition-all relative ${
              activeTab === tab.id ? "text-accent" : "text-foreground/60 hover:text-foreground/80"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Leaderboard Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {loading ? (
            <div className="text-center py-8 text-foreground/50">Loading leaderboard...</div>
          ) : currentScores.length === 0 ? (
            <div className="text-center py-8 text-foreground/50">
              No scores yet. Be the first to complete the quiz!
            </div>
          ) : (
            <div className="genswarm-leaderboard space-y-2">
              {currentScores.map((entry, index) => (
                <motion.div
                  key={`${entry.handle}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={glassStyle}
                  className="rounded-lg p-4 flex items-center justify-between hover:border-accent/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank */}
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-accent text-sm">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </span>
                    </div>

                    {/* Handle */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={`https://x.com/${entry.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:underline truncate"
                      >
                        @{entry.handle}
                      </a>
                      <p className="text-xs text-foreground/50">{entry.date}</p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-accent">{entry.score}</div>
                    <p className="text-xs text-foreground/50">points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
