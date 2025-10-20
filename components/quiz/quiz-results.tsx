"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { glassStyle } from "@/lib/utils"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  difficulty: string
  handle: string
  questions: Array<{
    id: number
    question: string
    options: string[]
    correct: number
  }>
  userAnswers: number[]
  onPlayAgain: () => void
  onHome: () => void
}

export function QuizResults({
  score,
  totalQuestions,
  difficulty,
  handle,
  questions,
  userAnswers,
  onPlayAgain,
  onHome,
}: QuizResultsProps) {
  const hasSubmittedRef = React.useRef(false)
  const percentage = Math.round((score / totalQuestions) * 100)
  const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on the Gensyn ${difficulty} quiz! Can you beat my score? Join Genswarm at https://vercel.genswarm.app`
  const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  // ✅ Send results to leaderboard when this screen loads
  useEffect(() => {
    if (hasSubmittedRef.current) return
    hasSubmittedRef.current = true

    async function submitToLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle, score, difficulty }),
        })
        const json = await res.json()
        if (json.error) {
          console.error("❌ Failed to save score:", json.error)
        } else {
          console.log("✅ Score saved to leaderboard:", json.data)
        }
      } catch (err) {
        console.error("⚠️ Leaderboard submit error:", err)
      }
    }

    if (handle && score && difficulty) {
      submitToLeaderboard()
    }
  }, [handle, score, difficulty])


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Score Display */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block"
        >
          <div style={glassStyle} className="w-32 h-32 rounded-full flex items-center justify-center mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent">{score}</div>
              <div className="text-sm text-foreground/60">/ {totalQuestions}</div>
            </div>
          </div>
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold mb-2">
            {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
          </h2>
          <p className="text-foreground/60">You scored {percentage}%</p>
        </div>
      </div>

      {/* Correct Answers Summary */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Review Your Answers</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {questions.map((q, idx) => {
            const isCorrect = userAnswers[idx] === q.correct
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={glassStyle}
                className={`rounded-lg p-4 border-l-4 text-white ${
                  isCorrect ? "border-accent" : "border-destructive"
                }`}
              >
                <p className="font-medium mb-2">{q.question}</p>
                <p className="text-sm text-white/70 mb-1">
                  Your answer:{" "}
                  <span className={isCorrect ? "text-accent" : "text-destructive"}>
                    {q.options[userAnswers[idx]]}
                  </span>
                </p>
                {!isCorrect && <p className="text-sm text-accent">Correct answer: {q.options[q.correct]}</p>}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-accent text-white hover:bg-accent/90 font-semibold">Share on X</Button>
        </a>
        <Button
          onClick={onPlayAgain}
          variant="outline"
          className="w-full border-accent/30 text-white hover:bg-accent/10 bg-transparent font-semibold"
        >
          Play Again
        </Button>
        <Button
          onClick={onHome}
          variant="outline"
          className="w-full border-accent/30 text-white hover:bg-accent/10 bg-transparent font-semibold"
        >
          Back Home
        </Button>
      </div>
    </motion.div>
  )
}
