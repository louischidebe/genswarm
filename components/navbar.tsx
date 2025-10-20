"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Navbar() {
  const navItems = [
    { label: "Quiz", href: "/quiz" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Resources", href: "/#guides" },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      /* Updated styling for clean black-and-white theme */
      className="sticky top-0 z-50 border-b border-border bg-background shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">Genswarm</span>
          </Link>

          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
