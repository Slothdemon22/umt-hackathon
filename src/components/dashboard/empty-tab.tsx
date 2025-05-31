"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export const EmptyTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-black/40 border-white/10 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <div className="p-8 bg-black/30 backdrop-blur-sm rounded-full mb-8 border border-white/10 shadow-lg shadow-purple-500/10">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
            Coming Soon
          </h3>
          <p className="text-slate-400 max-w-md text-lg">
            We're working on something exciting. Stay tuned for new features and improvements.
          </p>
        </div>
      </Card>
    </motion.div>
  )
} 