"use client"

import { useState } from "react"
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "./theme-toggle"
import TimelineView from "./timeline-view"
import TimeBreakdown from "./time-breakdown"
import CategoryBreakdown from "./category-breakdown"
import type { ViewType } from "@/lib/types"
import { mockWeeklyData, categories, getMockDataForDate } from "@/lib/mock-data"

export default function TimeTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 4, 5)) // May 5, 2025 (Monday)
  const [viewType, setViewType] = useState<ViewType>("day")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  // Remove the isLoading state and useEffect that simulates loading
  // Remove the AnimatePresence and conditional rendering based on isLoading

  // 1. Remove these lines:
  // const [isLoading, setIsLoading] = useState(true)

  // Simulate loading when changing date or view type
  // useEffect(() => {
  //   setIsLoading(true)
  //   const timer = setTimeout(() => {
  //     setIsLoading(false)
  //   }, 800)
  //   return () => clearTimeout(timer)
  // }, [selectedDate, viewType])

  // Get the appropriate data based on the selected date and view type
  const data = viewType === "day" ? getMockDataForDate(selectedDate) : mockWeeklyData

  const handlePrevious = () => {
    if (viewType === "day") {
      setSelectedDate(subDays(selectedDate, 1))
    } else {
      setSelectedDate(subWeeks(selectedDate, 1))
    }
  }

  const handleNext = () => {
    if (viewType === "day") {
      setSelectedDate(addDays(selectedDate, 1))
    } else {
      setSelectedDate(addWeeks(selectedDate, 1))
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setIsCalendarOpen(false)
    }
  }

  const handleViewChange = (value: string) => {
    setViewType(value as ViewType)
  }

  const displayDate =
    viewType === "day"
      ? format(selectedDate, "EEEE, MMMM d, yyyy")
      : `Week of ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMMM d, yyyy")}`

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  return (
    <motion.div className="space-y-6 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="flex justify-between items-center">
        <motion.h1 className="text-2xl font-bold" variants={itemVariants}>
          Time Timeline
        </motion.h1>
        <motion.div variants={itemVariants}>
          <ThemeToggle />
        </motion.div>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[240px] justify-start text-left font-normal transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {format(selectedDate, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <motion.span
            className="text-lg font-medium ml-2"
            layoutId="date-display"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {displayDate}
          </motion.span>
        </div>

        <Tabs defaultValue="day" value={viewType} onValueChange={handleViewChange}>
          <TabsList>
            <TabsTrigger value="day" className="transition-all duration-300 data-[state=active]:scale-105">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="transition-all duration-300 data-[state=active]:scale-105">
              Week
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* 2. Replace the AnimatePresence and conditional rendering for TimelineView with: */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
      >
        <TimelineView data={data} categories={categories} viewType={viewType} />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 3. Replace the AnimatePresence and conditional rendering for TimeBreakdown with: */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
        >
          <TimeBreakdown data={data} />
        </motion.div>

        {/* 4. Replace the AnimatePresence and conditional rendering for CategoryBreakdown with: */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
        >
          <CategoryBreakdown data={data} categories={categories} />
        </motion.div>
      </div>
    </motion.div>
  )
}
