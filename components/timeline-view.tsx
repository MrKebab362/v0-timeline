"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import type { TimeBlock, Category, ViewType } from "@/lib/types"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import TimeBlockModal from "./time-block-modal"

interface TimelineViewProps {
  data: TimeBlock[]
  categories: Category[]
  viewType: ViewType
}

export default function TimelineView({ data, categories, viewType }: TimelineViewProps) {
  const [hoveredBlock, setHoveredBlock] = useState<TimeBlock | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(data)
  const [openHoverCardId, setOpenHoverCardId] = useState<string | null>(null)
  const { theme } = useTheme()

  // Ref to track if mouse is over a block
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Ref to store the hover timer
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Hover delay in milliseconds (300ms is a good balance)
  const HOVER_DELAY = 300

  // Update timeBlocks when data changes
  if (JSON.stringify(data) !== JSON.stringify(timeBlocks)) {
    setTimeBlocks(data)
  }

  // Generate time labels based on view type
  const timeLabels =
    viewType === "day" ? Array.from({ length: 19 }, (_, i) => `${i + 6}:00`) : ["Mon", "Tue", "Wed", "Thu", "Fri"]

  // Calculate timeline width and positioning
  const timelineWidth = 100 // percentage
  const startHour = viewType === "day" ? 6 : 0 // 6am for day view, Monday (0) for week view
  const totalHours = viewType === "day" ? 18 : 5 // 18 hours (6am-midnight) for day, 5 days for week

  const getBlockStyle = (block: TimeBlock) => {
    // For day view, calculate position based on time
    if (viewType === "day") {
      const startTime = new Date(block.startTime)
      const endTime = new Date(block.endTime)

      const startHourDecimal = startTime.getHours() + startTime.getMinutes() / 60
      const endHourDecimal = endTime.getHours() + endTime.getMinutes() / 60

      const startPosition = ((startHourDecimal - startHour) / totalHours) * 100
      const width = ((endHourDecimal - startHourDecimal) / totalHours) * 100

      return {
        left: `${startPosition}%`,
        width: `${width}%`,
      }
    } else {
      // For week view, calculate position based on day of week
      const startTime = new Date(block.startTime)
      const endTime = new Date(block.endTime)

      const dayOfWeek = startTime.getDay() - 1 // 0 = Monday
      const startPosition = (dayOfWeek / totalHours) * 100
      const width = (1 / totalHours) * 100 // Each day is 1/5 of the timeline

      return {
        left: `${startPosition}%`,
        width: `${width}%`,
      }
    }
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)

    if (categoryId === "idle") {
      return theme === "dark"
        ? "linear-gradient(135deg, rgba(42, 42, 42, 0.4) 0%, rgba(51, 51, 51, 0.4) 100%)"
        : "linear-gradient(135deg, rgba(245, 245, 245, 0.5) 0%, rgba(235, 235, 235, 0.5) 100%)"
    }

    switch (categoryId) {
      case "university":
        return "linear-gradient(135deg, #4A78BD 0%, #5D8AC9 100%)"
      case "business":
        return "linear-gradient(135deg, #E19A3C 0%, #F0B05C 100%)"
      case "trw":
        return "linear-gradient(135deg, #6BB536 0%, #7FC84A 100%)"
      case "ai-automation":
        return "linear-gradient(135deg, #A23BC9 0%, #B44FD8 100%)"
      default:
        return category?.color || (theme === "dark" ? "rgba(58, 58, 58, 0.4)" : "rgba(232, 232, 232, 0.5)")
    }
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    const hours = Math.floor(durationMinutes / 60)
    const minutes = Math.floor(durationMinutes % 60)

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "Idle Time"
  }

  const handleBlockClick = (block: TimeBlock) => {
    setSelectedBlock(block)
    setIsModalOpen(true)
  }

  const handleSaveBlock = (updatedBlock: TimeBlock) => {
    setTimeBlocks(timeBlocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)))
  }

  // Handle mouse enter on block
  const handleMouseEnter = (block: TimeBlock) => {
    setHoveredBlock(block)

    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }

    // Set a new timer to show the tooltip after the delay
    hoverTimerRef.current = setTimeout(() => {
      setOpenHoverCardId(block.id)
    }, HOVER_DELAY)
  }

  // Handle mouse leave on block
  const handleMouseLeave = () => {
    setHoveredBlock(null)

    // Clear the hover timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }

    // Immediately hide the tooltip
    setOpenHoverCardId(null)
  }

  // Add global mouse move listener to check if mouse is over any block
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      let isOverAnyBlock = false

      // Check if mouse is over any of our blocks
      blockRefs.current.forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          isOverAnyBlock = true
        }
      })

      // If not over any block, clear timer and close any open hover card
      if (!isOverAnyBlock) {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current)
          hoverTimerRef.current = null
        }
        setOpenHoverCardId(null)
      }
    }

    window.addEventListener("mousemove", handleGlobalMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      // Clean up any timers when component unmounts
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <motion.div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="p-6">
          <div className="relative h-24 w-full">
            {/* Timeline blocks */}
            <div className="absolute inset-0 rounded-md bg-muted/20 dark:bg-muted/10">
              {/* Background pattern for empty slots */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <pattern
                    id="diagonalPattern"
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                    patternTransform="rotate(45)"
                  >
                    <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#diagonalPattern)" />
                </svg>
              </div>

              <AnimatePresence>
                {timeBlocks.map((block) => (
                  <HoverCard
                    key={block.id}
                    open={openHoverCardId === block.id}
                    onOpenChange={(open) => {
                      if (open) {
                        // Don't set open here - let the timer handle it
                      } else if (openHoverCardId === block.id) {
                        setOpenHoverCardId(null)
                      }
                    }}
                  >
                    <HoverCardTrigger asChild>
                      <motion.div
                        ref={(el) => {
                          if (el) blockRefs.current.set(block.id, el)
                          else blockRefs.current.delete(block.id)
                        }}
                        className={`absolute h-full rounded-md cursor-pointer transition-all ${
                          block.categoryId === "idle"
                            ? "hover:opacity-80"
                            : "shadow-sm hover:shadow-md hover:translate-y-[-1px] hover:opacity-90"
                        } ${block.description ? "ring-1 ring-primary/40" : ""}`}
                        style={{
                          ...getBlockStyle(block),
                          background: getCategoryColor(block.categoryId),
                        }}
                        onMouseEnter={() => handleMouseEnter(block)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleBlockClick(block)}
                        layoutId={`block-${block.id}`}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          duration: 0.4,
                        }}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      />
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="top"
                      align="center"
                      className="w-80"
                      asChild
                      forceMount={openHoverCardId === block.id}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{getCategoryName(block.categoryId)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(block.startTime)} - {formatTime(block.endTime)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {formatDuration(block.startTime, block.endTime)}
                          </p>
                          {block.description && <p className="text-sm">{block.description}</p>}
                          <p className="text-xs text-muted-foreground mt-2">Click to add details</p>
                        </div>
                      </motion.div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Time labels */}
          <div className="relative mt-1 flex justify-between">
            {timeLabels.map((label, index) => (
              <motion.div
                key={index}
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                {label}
              </motion.div>
            ))}
          </div>

          {/* Category legend */}
          <div className="mt-4 flex flex-wrap gap-4">
            {categories
              .filter((category) => category.id !== "idle")
              .map((category, index) => (
                <motion.div
                  key={category.id}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <motion.div
                    className="h-3 w-3 rounded-full"
                    style={{
                      background:
                        category.id === "university"
                          ? "linear-gradient(135deg, #4A78BD 0%, #5D8AC9 100%)"
                          : category.id === "business"
                            ? "linear-gradient(135deg, #E19A3C 0%, #F0B05C 100%)"
                            : category.id === "trw"
                              ? "linear-gradient(135deg, #6BB536 0%, #7FC84A 100%)"
                              : "linear-gradient(135deg, #A23BC9 0%, #B44FD8 100%)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="text-xs">{category.name}</span>
                </motion.div>
              ))}
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: categories.length * 0.05 }}
            >
              <motion.div
                className="h-3 w-3 rounded-full"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, rgba(42, 42, 42, 0.4) 0%, rgba(51, 51, 51, 0.4) 100%)"
                      : "linear-gradient(135deg, rgba(245, 245, 245, 0.5) 0%, rgba(235, 235, 235, 0.5) 100%)",
                }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-xs text-muted-foreground">Idle Time</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Time Block Modal */}
      <TimeBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        block={selectedBlock}
        categories={categories}
        onSave={handleSaveBlock}
      />
    </>
  )
}
