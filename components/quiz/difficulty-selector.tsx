"use client"

import { motion } from "framer-motion"

interface DifficultySelectorProps {
  onSelect: (difficulty: "easy" | "medium" | "hard") => void
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const difficulties = [
    { level: "easy", label: "Easy", description: "Perfect for beginners" },
    { level: "medium", label: "Medium", description: "For the curious" },
    { level: "hard", label: "Hard", description: "For the experts" },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Select Difficulty</h2>
        <p className="text-foreground/60">Choose your challenge level</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((diff) => (
          <motion.button
            key={diff.level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(diff.level)}
            /* Updated styling for black-and-white theme with black text on white background */
            className="rounded-xl p-6 text-left border-2 border-border bg-card hover:border-accent hover:bg-secondary transition-all text-foreground"
          >
            <h3 className="text-xl font-bold text-accent mb-2">{diff.label}</h3>
            <p className="text-sm text-foreground/70">{diff.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
