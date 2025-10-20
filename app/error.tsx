"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-foreground/70 mb-8">{error.message || "An unexpected error occurred"}</p>
        <Button onClick={() => reset()} className="bg-accent text-primary hover:bg-accent/90">
          Try again
        </Button>
      </motion.div>
    </div>
  )
}
