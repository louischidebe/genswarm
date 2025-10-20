"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { glassStyle } from "@/lib/utils"

interface HandleInputProps {
  onSubmit: (handle: string) => void
  onBack: () => void
}

export function HandleInput({ onSubmit, onBack }: HandleInputProps) {
  const [handle, setHandle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (handle.trim()) {
      onSubmit(handle.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Enter Your X Handle</h2>
        <p className="text-foreground/60">For the leaderboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-3 text-foreground/60">@</span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="yourhandle"
            style={glassStyle}
            className="w-full pl-8 pr-4 py-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-accent/30 text-white hover:bg-accent/10 bg-transparent font-semibold"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!handle.trim()}
            className="flex-1 bg-accent text-white hover:bg-accent/90 font-semibold"
          >
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
