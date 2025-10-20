"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { glassStyle } from "@/lib/utils"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
              <p className="text-foreground/60 mb-6">
                Top scores across all difficulty levels. Can you make it to the top?
              </p>
              <Link href="/quiz">
                <Button className="bg-accent text-white hover:bg-accent/90">Take the Quiz</Button>
              </Link>
            </div>

            <div style={glassStyle} className="rounded-2xl p-8">
              <LeaderboardTabs />
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
