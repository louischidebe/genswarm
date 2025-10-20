"use client"

import { motion } from "framer-motion"
import { glassStyle } from "@/lib/utils"

interface QuizQuestionProps {
  question: {
    id: number
    question: string
    options: string[]
    correct: number
  }
  currentQuestion: number
  totalQuestions: number
  onAnswer: (selectedIndex: number) => void
}

export function QuizQuestion({ question, currentQuestion, totalQuestions, onAnswer }: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-foreground/60">
          <span>Question {currentQuestion + 1}</span>
          <span>{totalQuestions}</span>
        </div>
        <div style={glassStyle} className="w-full h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      {/* Question */}
      <div>
        <h3 className="text-2xl font-bold mb-6">{question.question}</h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(index)}
              style={glassStyle}
              className="w-full rounded-lg p-4 text-left hover:border-accent/50 transition-all text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-accent/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-accent opacity-0 group-hover:opacity-100" />
                </div>
                <span>{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
