"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface ResourceCard {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

export function ResourceCards() {
  const resources: ResourceCard[] = [
    {
      title: "Documentation",
      description: "Learn about Gensyn architecture, concepts, and how to get started",
      icon: "📚",
      href: "https://docs.gensyn.ai",
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      title: "Testnet",
      description: "Experiment with Gensyn on the testnet before mainnet deployment",
      icon: "🧪",
      href: "https://testnet.gensyn.ai",
      color: "from-purple-500/20 to-purple-600/20",
    },
    {
      title: "Blog",
      description: "Read the latest updates, announcements, and insights from the team",
      icon: "📝",
      href: "https://blog.gensyn.ai",
      color: "from-pink-500/20 to-pink-600/20",
    },
    {
      title: "Research",
      description: "Explore academic papers and technical research on distributed AI",
      icon: "🔬",
      href: "https://research.gensyn.ai",
      color: "from-green-500/20 to-green-600/20",
    },
    {
      title: "Litepaper",
      description: "Read the comprehensive litepaper explaining Gensyn's vision and design",
      icon: "📄",
      href: "https://litepaper.gensyn.ai",
      color: "from-orange-500/20 to-orange-600/20",
    },
    {
      title: "RL Swarm",
      description: "Discover how reinforcement learning powers Gensyn's coordination",
      icon: "🐝",
      href: "https://github.com/gensyn-ai/rl-swarm",
      color: "from-cyan-500/20 to-cyan-600/20",
    },
    {
      title: "BlockAssist",
      description: "AI-powered development tools for building on Gensyn",
      icon: "⚙️",
      href: "https://github.com/gensyn-ai/blockassist",
      color: "from-indigo-500/20 to-indigo-600/20",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {resources.map((resource) => (
        <motion.div key={resource.title} variants={itemVariants}>
          <Link href={resource.href} target="_blank" rel="noopener noreferrer">
            <div
              /* Updated styling for black-and-white theme with subtle shadows */
              className="rounded-xl p-6 h-full border-2 border-border bg-card hover:border-accent hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{resource.icon}</span>
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-accent text-lg">→</span>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{resource.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{resource.description}</p>

              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
