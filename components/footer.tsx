"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Footer() {
  const links = [
    { label: "Docs", href: "https://docs.gensyn.ai" },
    { label: "Testnet", href: "https://testnet.gensyn.ai" },
    { label: "Blog", href: "https://blog.gensyn.ai" },
    { label: "Research", href: "https://research.gensyn.ai" },
    { label: "Litepaper", href: "https://litepaper.gensyn.ai" },
    { label: "RL Swarm", href: "https://github.com/gensyn-ai/rl-swarm" },
    { label: "BlockAssist", href: "https://github.com/gensyn-ai/blockassist" },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      /* Updated styling for clean black-and-white theme */
      className="border-t border-border bg-background mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-border">
          <p className="text-xs text-foreground/50">© 2025 Genswarm – A community hub for the Gensyn community.</p>
          <div className="flex gap-4">
            <Link
              href="https://discord.gg/gensyn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-foreground transition-colors"
            >
              <span className="text-sm">Discord</span>
            </Link>
            <Link
              href="https://x.com/gensynai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-foreground transition-colors"
            >
              <span className="text-sm">X</span>
            </Link>
          </div>
        </div>

        <p className="text-xs text-foreground/40 mt-4">
          Built by{" "}
          <Link
            href="https://x.com/0xLoui5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            @0xLoui5
          </Link>
        </p>
      </div>
    </motion.footer>
  )
}
