"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import type { TimeBlock, Category } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryBreakdownProps {
  data: TimeBlock[]
  categories: Category[]
}

export default function CategoryBreakdown({ data, categories }: CategoryBreakdownProps) {
  const categoryStats = useMemo(() => {
    // Calculate total productive time
    const productiveBlocks = data.filter((block) => block.categoryId !== "idle")
    const totalProductiveMinutes = productiveBlocks.reduce((total, block) => {
      const start = new Date(block.startTime)
      const end = new Date(block.endTime)
      return total + (end.getTime() - start.getTime()) / (1000 * 60)
    }, 0)

    // Calculate time per category
    const stats = categories
      .filter((category) => category.id !== "idle")
      .map((category) => {
        const categoryBlocks = data.filter((block) => block.categoryId === category.id)
        const categoryMinutes = categoryBlocks.reduce((total, block) => {
          const start = new Date(block.startTime)
          const end = new Date(block.endTime)
          return total + (end.getTime() - start.getTime()) / (1000 * 60)
        }, 0)

        const percentage = totalProductiveMinutes > 0 ? Math.round((categoryMinutes / totalProductiveMinutes) * 100) : 0

        return {
          id: category.id,
          name: category.name,
          color: category.color,
          time: formatTime(categoryMinutes),
          minutes: categoryMinutes,
          percentage,
        }
      })
      .sort((a, b) => b.minutes - a.minutes) // Sort by time spent (descending)

    return stats
  }, [data, categories])

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
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="space-y-1"
              layoutId={`category-${stat.id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-3 w-3 rounded-full"
                    style={{
                      background:
                        stat.id === "university"
                          ? "linear-gradient(135deg, #4A78BD 0%, #5D8AC9 100%)"
                          : stat.id === "business"
                            ? "linear-gradient(135deg, #E19A3C 0%, #F0B05C 100%)"
                            : stat.id === "trw"
                              ? "linear-gradient(135deg, #6BB536 0%, #7FC84A 100%)"
                              : "linear-gradient(135deg, #A23BC9 0%, #B44FD8 100%)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span>{stat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    layoutId={`time-${stat.id}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {stat.time}
                  </motion.span>
                  <motion.span
                    className="text-sm text-muted-foreground"
                    layoutId={`percentage-${stat.id}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {stat.percentage}%
                  </motion.span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/50">
                <motion.div
                  className="h-2 rounded-full shadow-sm"
                  style={{
                    background:
                      stat.id === "university"
                        ? "linear-gradient(135deg, #4A78BD 0%, #5D8AC9 100%)"
                        : stat.id === "business"
                          ? "linear-gradient(135deg, #E19A3C 0%, #F0B05C 100%)"
                          : stat.id === "trw"
                            ? "linear-gradient(135deg, #6BB536 0%, #7FC84A 100%)"
                            : "linear-gradient(135deg, #A23BC9 0%, #B44FD8 100%)",
                  }}
                  initial={false}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 60,
                    damping: 15,
                  }}
                  layoutId={`bar-${stat.id}`}
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
