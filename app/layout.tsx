import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Genswarm - Gensyn Community Hub",
  description: "A community hub for the Gensyn network. Join the swarm.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}
