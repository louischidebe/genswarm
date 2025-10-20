"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { QuizContainer } from "@/components/quiz/quiz-container"
import { motion } from "framer-motion"
import { glassStyle } from "@/lib/utils"

export default function QuizPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={glassStyle}
            className="rounded-2xl p-8 md:p-12"
          >
            <h1 className="text-4xl font-bold mb-2 text-center">Gensyn Knowledge Quiz</h1>
            <p className="text-center text-foreground/60 mb-8">
              Test your knowledge about Gensyn and compete on the leaderboard
            </p>
            <QuizContainer />
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
