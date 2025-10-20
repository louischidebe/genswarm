"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-foreground/70 mb-8">Page not found</p>
        <Link href="/">
          <Button className="bg-accent text-primary hover:bg-accent/90">Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  )
}
