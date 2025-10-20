"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ResourceCards } from "@/components/resource-cards"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { glassStyle } from "@/lib/utils"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Welcome to <span className="text-accent">Genswarm</span>
            </h1>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto text-balance">
              Join the community hub for the Gensyn community. Test your knowledge, compete on the leaderboard, and chat
              with our AI assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz">
                <Button className="bg-accent text-white hover:bg-accent/90 px-8">Take the Quiz</Button>
              </Link>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  className="border-accent/30 text-foreground hover:bg-accent/10 bg-transparent px-8"
                >
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Resources Section */}
        <section id="guides" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Explore Gensyn</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Access all official Gensyn resources and tools to learn more about the network
            </p>
          </motion.div>

          <ResourceCards />
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={glassStyle}
            className="rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Swarm?</h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Test your knowledge about Gensyn, compete with the community, and become part of the distributed AI
              revolution.
            </p>
            <Link href="/quiz">
              <Button className="bg-accent text-white hover:bg-accent/90 px-8 py-6 text-lg">Start the Quiz Now</Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
