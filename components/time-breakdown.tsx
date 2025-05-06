"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import type { TimeBlock } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TimeBreakdownProps {
  data: TimeBlock[]
}

export default function TimeBreakdown({ data }: TimeBreakdownProps) {
  const { productiveTime, idleTime, productivePercentage } = useMemo(() => {
    const productive = data.filter((block) => block.categoryId !== "idle")
    const idle = data.filter((block) => block.categoryId === "idle")

    const productiveMinutes = productive.reduce((total, block) => {
      const start = new Date(block.startTime)
      const end = new Date(block.endTime)
      return total + (end.getTime() - start.getTime()) / (1000 * 60)
    }, 0)

    const idleMinutes = idle.reduce((total, block) => {
      const start = new Date(block.startTime)
      const end = new Date(block.endTime)
      return total + (end.getTime() - start.getTime()) / (1000 * 60)
    }, 0)

    const totalMinutes = productiveMinutes + idleMinutes
    const percentage = totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0

    return {
      productiveTime: formatTime(productiveMinutes),
      idleTime: formatTime(idleMinutes),
      productivePercentage: percentage,
    }
  }, [data])

  function formatTime(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours} hr ${mins} min`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Time Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="relative h-40 w-40 flex items-center justify-center">
              {/* Circular progress */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted-foreground/10"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <motion.circle
                  className="text-primary"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                  style={{
                    filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))",
                  }}
                  initial={false}
                  animate={{ strokeDasharray: `${productivePercentage * 2.51} 251` }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 60,
                    damping: 15,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-3xl font-bold"
                  layoutId="percentage-text"
                  transition={{ type: "spring", stiffness: 200, damping: 30 }}
                >
                  {productivePercentage}%
                </motion.span>
                <span className="text-sm text-muted-foreground">Focus</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="rounded-lg border p-4 shadow-sm"
              layoutId="productive-time-card"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-sm text-muted-foreground">Productive Time</div>
              <motion.div
                className="text-xl font-semibold"
                layoutId="productive-time-text"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {productiveTime}
              </motion.div>
            </motion.div>
            <motion.div
              className="rounded-lg border p-4 shadow-sm"
              layoutId="idle-time-card"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-sm text-muted-foreground">Idle Time</div>
              <motion.div
                className="text-xl font-semibold"
                layoutId="idle-time-text"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {idleTime}
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
