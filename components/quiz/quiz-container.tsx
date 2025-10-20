"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DifficultySelector } from "./difficulty-selector"
import { HandleInput } from "./handle-input"
import { QuizQuestion } from "./quiz-question"
import { QuizResults } from "./quiz-results"

type QuizStep = "difficulty" | "handle" | "quiz" | "results"

interface QuizData {
  questions: Array<{
    id: number
    question: string
    options: string[]
    correct: number
  }>
}

export function QuizContainer() {
  const [step, setStep] = useState<QuizStep>("difficulty")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [handle, setHandle] = useState("")
  const [questions, setQuestions] = useState<QuizData["questions"]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [score, setScore] = useState(0)

  // Load quiz data
  useEffect(() => {
    if (step === "quiz" && questions.length === 0) {
      fetch(`/data/quiz_${difficulty}.json`)
        .then((res) => res.json())
        .then((data: QuizData) => {
          // helper to shuffle arrays
          const shuffleArray = <T,>(array: T[]): T[] =>
            array
              .map((value) => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);

          // shuffle questions AND their options
          const shuffledQuestions = data.questions.map((q) => {
            const shuffledOptions = shuffleArray(q.options);
            const newCorrectIndex = shuffledOptions.indexOf(q.options[q.correct]);
            return { ...q, options: shuffledOptions, correct: newCorrectIndex };
          });

          const shuffled = shuffleArray(shuffledQuestions);
          setQuestions(shuffled);
        })
        .catch((err) => console.error("Error loading quiz:", err));
    }
  }, [step, difficulty, questions.length]);


  const handleDifficultySelect = (selectedDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(selectedDifficulty)
    setStep("handle")
  }

  const handleHandleSubmit = (xHandle: string) => {
    setHandle(xHandle)
    setCurrentQuestion(0)
    setUserAnswers([])
    setScore(0)
    setStep("quiz")
  }

  const handleAnswer = (selectedIndex: number) => {
    const newAnswers = [...userAnswers, selectedIndex]
    setUserAnswers(newAnswers)

    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Save to leaderboard
      saveToLeaderboard(score + (selectedIndex === questions[currentQuestion].correct ? 1 : 0))
      setStep("results")
    }
  }

  const saveToLeaderboard = async (finalScore: number) => {
    try {
      const leaderboardData = await fetch(`/data/leaderboard.json`).then((res) => res.json())
      const entry = {
        handle,
        score: finalScore,
        date: new Date().toISOString().split("T")[0],
      }

      leaderboardData[difficulty].push(entry)
      leaderboardData[difficulty].sort((a: any, b: any) => b.score - a.score)
      leaderboardData[difficulty] = leaderboardData[difficulty].slice(0, 10)

      // Store in localStorage as fallback
      localStorage.setItem("genswarm_leaderboard", JSON.stringify(leaderboardData))
    } catch (error) {
      console.error("Error saving to leaderboard:", error)
    }
  }

  const handlePlayAgain = () => {
    setStep("difficulty")
    setQuestions([])
    setCurrentQuestion(0)
    setUserAnswers([])
    setScore(0)
  }

  const handleHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "difficulty" && (
          <motion.div key="difficulty" exit={{ opacity: 0, y: -20 }}>
            <DifficultySelector onSelect={handleDifficultySelect} />
          </motion.div>
        )}

        {step === "handle" && (
          <motion.div key="handle" exit={{ opacity: 0, y: -20 }}>
            <HandleInput onSubmit={handleHandleSubmit} onBack={() => setStep("difficulty")} />
          </motion.div>
        )}

        {step === "quiz" && questions.length > 0 && (
          <motion.div key="quiz" exit={{ opacity: 0, y: -20 }}>
            <QuizQuestion
              question={questions[currentQuestion]}
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}

        {step === "results" && (
          <motion.div key="results" exit={{ opacity: 0, y: -20 }}>
            <QuizResults
              score={score}
              totalQuestions={questions.length}
              difficulty={difficulty}
              handle={handle}
              questions={questions}
              userAnswers={userAnswers}
              onPlayAgain={handlePlayAgain}
              onHome={handleHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
