"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Types
type ViewType = "day" | "week"

interface TimeBlock {
  id: string
  categoryId: string
  startTime: string
  endTime: string
  description?: string
}

interface Category {
  id: string
  name: string
  color: string
}

// Mock data - Categories
const categories: Category[] = [
  {
    id: "university",
    name: "University Work",
    color: "#4A78BD", // More muted blue
  },
  {
    id: "business",
    name: "Business Work",
    color: "#E19A3C", // Softer orange
  },
  {
    id: "trw",
    name: "TRW Work",
    color: "#6BB536", // Muted green
  },
  {
    id: "ai-automation",
    name: "AI Automation Campus",
    color: "#A23BC9", // Softer purple
  },
  {
    id: "idle",
    name: "Idle Time",
    color: "#E8E8E8", // Light gray
  },
]

// Base date for our mock data (Monday)
const baseDate = new Date(2025, 4, 5) // May 5, 2025

// Helper function to create a date string with the specified day and time
const createDateString = (dayOffset: number, hours: number, minutes = 0) => {
  const date = addDays(baseDate, dayOffset)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

// Generate mock data for Monday (day 0)
const generateMondayData = (): TimeBlock[] => [
  // Morning
  {
    id: "mon-1",
    categoryId: "idle",
    startTime: createDateString(0, 6, 0),
    endTime: createDateString(0, 9, 0),
    description: "Morning idle time",
  },
  {
    id: "mon-2",
    categoryId: "university",
    startTime: createDateString(0, 9, 0),
    endTime: createDateString(0, 10, 30),
    description: "Research paper review",
  },
  {
    id: "mon-3",
    categoryId: "idle",
    startTime: createDateString(0, 10, 30),
    endTime: createDateString(0, 11, 0),
    description: "Coffee break",
  },
  // Mid-day
  {
    id: "mon-4",
    categoryId: "business",
    startTime: createDateString(0, 11, 0),
    endTime: createDateString(0, 12, 30),
    description: "Client meeting",
  },
  {
    id: "mon-5",
    categoryId: "idle",
    startTime: createDateString(0, 12, 30),
    endTime: createDateString(0, 13, 30),
    description: "Lunch break",
  },
  {
    id: "mon-6",
    categoryId: "trw",
    startTime: createDateString(0, 13, 30),
    endTime: createDateString(0, 15, 0),
    description: "Project planning",
  },
  {
    id: "mon-7",
    categoryId: "idle",
    startTime: createDateString(0, 15, 0),
    endTime: createDateString(0, 15, 30),
    description: "Short break",
  },
  // Afternoon
  {
    id: "mon-8",
    categoryId: "ai-automation",
    startTime: createDateString(0, 15, 30),
    endTime: createDateString(0, 18, 30),
    description: "AI model training",
  },
  {
    id: "mon-9",
    categoryId: "idle",
    startTime: createDateString(0, 18, 30),
    endTime: createDateString(0, 19, 0),
    description: "Dinner break",
  },
  // Evening
  {
    id: "mon-10",
    categoryId: "university",
    startTime: createDateString(0, 19, 0),
    endTime: createDateString(0, 20, 0),
    description: "Lecture preparation",
  },
  {
    id: "mon-11",
    categoryId: "business",
    startTime: createDateString(0, 20, 0),
    endTime: createDateString(0, 21, 0),
    description: "Email correspondence",
  },
  {
    id: "mon-12",
    categoryId: "idle",
    startTime: createDateString(0, 21, 0),
    endTime: createDateString(0, 24, 0),
    description: "Evening relaxation",
  },
]

// Generate mock data for Tuesday (day 1)
const generateTuesdayData = (): TimeBlock[] => [
  // Morning
  {
    id: "tue-1",
    categoryId: "idle",
    startTime: createDateString(1, 6, 0),
    endTime: createDateString(1, 8, 30),
    description: "Morning routine",
  },
  {
    id: "tue-2",
    categoryId: "business",
    startTime: createDateString(1, 8, 30),
    endTime: createDateString(1, 11, 0),
    description: "Quarterly planning meeting",
  },
  {
    id: "tue-3",
    categoryId: "idle",
    startTime: createDateString(1, 11, 0),
    endTime: createDateString(1, 11, 30),
    description: "Break",
  },
  // Mid-day
  {
    id: "tue-4",
    categoryId: "trw",
    startTime: createDateString(1, 11, 30),
    endTime: createDateString(1, 13, 0),
    description: "Code review session",
  },
  {
    id: "tue-5",
    categoryId: "idle",
    startTime: createDateString(1, 13, 0),
    endTime: createDateString(1, 14, 0),
    description: "Lunch break",
  },
  {
    id: "tue-6",
    categoryId: "ai-automation",
    startTime: createDateString(1, 14, 0),
    endTime: createDateString(1, 17, 30),
    description: "Feature development",
  },
  // Evening
  {
    id: "tue-7",
    categoryId: "idle",
    startTime: createDateString(1, 17, 30),
    endTime: createDateString(1, 18, 30),
    description: "Commute and dinner",
  },
  {
    id: "tue-8",
    categoryId: "university",
    startTime: createDateString(1, 18, 30),
    endTime: createDateString(1, 20, 30),
    description: "Grading assignments",
  },
  {
    id: "tue-9",
    categoryId: "idle",
    startTime: createDateString(1, 20, 30),
    endTime: createDateString(1, 24, 0),
    description: "Personal time",
  },
]

// Generate mock data for Wednesday (day 2)
const generateWednesdayData = (): TimeBlock[] => [
  // Morning
  {
    id: "wed-1",
    categoryId: "idle",
    startTime: createDateString(2, 6, 0),
    endTime: createDateString(2, 7, 30),
    description: "Morning routine",
  },
  {
    id: "wed-2",
    categoryId: "university",
    startTime: createDateString(2, 7, 30),
    endTime: createDateString(2, 10, 0),
    description: "Teaching undergraduate class",
  },
  {
    id: "wed-3",
    categoryId: "idle",
    startTime: createDateString(2, 10, 0),
    endTime: createDateString(2, 10, 30),
    description: "Coffee break",
  },
  // Mid-day
  {
    id: "wed-4",
    categoryId: "university",
    startTime: createDateString(2, 10, 30),
    endTime: createDateString(2, 12, 0),
    description: "Office hours",
  },
  {
    id: "wed-5",
    categoryId: "idle",
    startTime: createDateString(2, 12, 0),
    endTime: createDateString(2, 13, 0),
    description: "Lunch break",
  },
  {
    id: "wed-6",
    categoryId: "business",
    startTime: createDateString(2, 13, 0),
    endTime: createDateString(2, 15, 30),
    description: "Client proposal preparation",
  },
  {
    id: "wed-7",
    categoryId: "idle",
    startTime: createDateString(2, 15, 30),
    endTime: createDateString(2, 16, 0),
    description: "Short break",
  },
  // Afternoon
  {
    id: "wed-8",
    categoryId: "trw",
    startTime: createDateString(2, 16, 0),
    endTime: createDateString(2, 18, 0),
    description: "Team sync and planning",
  },
  {
    id: "wed-9",
    categoryId: "idle",
    startTime: createDateString(2, 18, 0),
    endTime: createDateString(2, 19, 0),
    description: "Commute and dinner",
  },
  // Evening
  {
    id: "wed-10",
    categoryId: "ai-automation",
    startTime: createDateString(2, 19, 0),
    endTime: createDateString(2, 21, 0),
    description: "Research and documentation",
  },
  {
    id: "wed-11",
    categoryId: "idle",
    startTime: createDateString(2, 21, 0),
    endTime: createDateString(2, 24, 0),
    description: "Personal time",
  },
]

// Generate mock data for Thursday (day 3)
const generateThursdayData = (): TimeBlock[] => [
  // Morning
  {
    id: "thu-1",
    categoryId: "idle",
    startTime: createDateString(3, 6, 0),
    endTime: createDateString(3, 9, 0),
    description: "Morning routine and commute",
  },
  {
    id: "thu-2",
    categoryId: "ai-automation",
    startTime: createDateString(3, 9, 0),
    endTime: createDateString(3, 11, 30),
    description: "Model optimization",
  },
  // Mid-day
  {
    id: "thu-3",
    categoryId: "idle",
    startTime: createDateString(3, 11, 30),
    endTime: createDateString(3, 12, 30),
    description: "Lunch break",
  },
  {
    id: "thu-4",
    categoryId: "business",
    startTime: createDateString(3, 12, 30),
    endTime: createDateString(3, 14, 30),
    description: "Investor meeting preparation",
  },
  {
    id: "thu-5",
    categoryId: "business",
    startTime: createDateString(3, 14, 30),
    endTime: createDateString(3, 16, 0),
    description: "Investor call",
  },
  {
    id: "thu-6",
    categoryId: "idle",
    startTime: createDateString(3, 16, 0),
    endTime: createDateString(3, 16, 30),
    description: "Break",
  },
  // Afternoon
  {
    id: "thu-7",
    categoryId: "trw",
    startTime: createDateString(3, 16, 30),
    endTime: createDateString(3, 19, 0),
    description: "Bug fixing and code review",
  },
  {
    id: "thu-8",
    categoryId: "idle",
    startTime: createDateString(3, 19, 0),
    endTime: createDateString(3, 20, 0),
    description: "Dinner",
  },
  // Evening
  {
    id: "thu-9",
    categoryId: "university",
    startTime: createDateString(3, 20, 0),
    endTime: createDateString(3, 21, 30),
    description: "Research paper writing",
  },
  {
    id: "thu-10",
    categoryId: "idle",
    startTime: createDateString(3, 21, 30),
    endTime: createDateString(3, 24, 0),
    description: "Personal time",
  },
]

// Generate mock data for Friday (day 4)
const generateFridayData = (): TimeBlock[] => [
  // Morning
  {
    id: "fri-1",
    categoryId: "idle",
    startTime: createDateString(4, 6, 0),
    endTime: createDateString(4, 8, 0),
    description: "Morning routine",
  },
  {
    id: "fri-2",
    categoryId: "trw",
    startTime: createDateString(4, 8, 0),
    endTime: createDateString(4, 10, 30),
    description: "Sprint planning",
  },
  {
    id: "fri-3",
    categoryId: "idle",
    startTime: createDateString(4, 10, 30),
    endTime: createDateString(4, 11, 0),
    description: "Coffee break",
  },
  // Mid-day
  {
    id: "fri-4",
    categoryId: "business",
    startTime: createDateString(4, 11, 0),
    endTime: createDateString(4, 12, 30),
    description: "Weekly business review",
  },
  {
    id: "fri-5",
    categoryId: "idle",
    startTime: createDateString(4, 12, 30),
    endTime: createDateString(4, 13, 30),
    description: "Lunch break",
  },
  {
    id: "fri-6",
    categoryId: "university",
    startTime: createDateString(4, 13, 30),
    endTime: createDateString(4, 15, 30),
    description: "Department meeting",
  },
  // Afternoon
  {
    id: "fri-7",
    categoryId: "idle",
    startTime: createDateString(4, 15, 30),
    endTime: createDateString(4, 16, 0),
    description: "Short break",
  },
  {
    id: "fri-8",
    categoryId: "ai-automation",
    startTime: createDateString(4, 16, 0),
    endTime: createDateString(4, 18, 0),
    description: "End of week documentation and planning",
  },
  // Evening - lighter schedule for Friday
  {
    id: "fri-9",
    categoryId: "idle",
    startTime: createDateString(4, 18, 0),
    endTime: createDateString(4, 24, 0),
    description: "Weekend begins - personal time",
  },
]

// Generate mock data for Saturday (day 5)
const generateSaturdayData = (): TimeBlock[] => [
  // Morning - weekend starts later
  {
    id: "sat-1",
    categoryId: "idle",
    startTime: createDateString(5, 6, 0),
    endTime: createDateString(5, 10, 0),
    description: "Weekend morning - personal time",
  },
  {
    id: "sat-2",
    categoryId: "university",
    startTime: createDateString(5, 10, 0),
    endTime: createDateString(5, 12, 0),
    description: "Research reading",
  },
  // Mid-day
  {
    id: "sat-3",
    categoryId: "idle",
    startTime: createDateString(5, 12, 0),
    endTime: createDateString(5, 14, 0),
    description: "Lunch and relaxation",
  },
  {
    id: "sat-4",
    categoryId: "business",
    startTime: createDateString(5, 14, 0),
    endTime: createDateString(5, 15, 30),
    description: "Catching up on emails",
  },
  // Afternoon and evening - mostly personal time
  {
    id: "sat-5",
    categoryId: "idle",
    startTime: createDateString(5, 15, 30),
    endTime: createDateString(5, 24, 0),
    description: "Weekend personal time",
  },
]

// Generate mock data for Sunday (day 6)
const generateSundayData = (): TimeBlock[] => [
  // Morning - weekend continues
  {
    id: "sun-1",
    categoryId: "idle",
    startTime: createDateString(6, 6, 0),
    endTime: createDateString(6, 11, 0),
    description: "Weekend morning - personal time",
  },
  {
    id: "sun-2",
    categoryId: "ai-automation",
    startTime: createDateString(6, 11, 0),
    endTime: createDateString(6, 13, 0),
    description: "Personal project work",
  },
  // Mid-day
  {
    id: "sun-3",
    categoryId: "idle",
    startTime: createDateString(6, 13, 0),
    endTime: createDateString(6, 15, 0),
    description: "Lunch and relaxation",
  },
  // Evening - preparation for the week
  {
    id: "sun-4",
    categoryId: "university",
    startTime: createDateString(6, 15, 0),
    endTime: createDateString(6, 17, 0),
    description: "Preparing for Monday's lecture",
  },
  {
    id: "sun-5",
    categoryId: "business",
    startTime: createDateString(6, 17, 0),
    endTime: createDateString(6, 18, 30),
    description: "Week planning and email organization",
  },
  {
    id: "sun-6",
    categoryId: "idle",
    startTime: createDateString(6, 18, 30),
    endTime: createDateString(6, 24, 0),
    description: "Evening relaxation before the work week",
  },
]

// Collection of all daily data
const mockWeekData = {
  monday: generateMondayData(),
  tuesday: generateTuesdayData(),
  wednesday: generateWednesdayData(),
  thursday: generateThursdayData(),
  friday: generateFridayData(),
  saturday: generateSaturdayData(),
  sunday: generateSundayData(),
}

// Helper function to get data for a specific date
const getMockDataForDate = (date: Date): TimeBlock[] => {
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.

  switch (dayOfWeek) {
    case 0:
      return mockWeekData.sunday
    case 1:
      return mockWeekData.monday
    case 2:
      return mockWeekData.tuesday
    case 3:
      return mockWeekData.wednesday
    case 4:
      return mockWeekData.thursday
    case 5:
      return mockWeekData.friday
    case 6:
      return mockWeekData.saturday
    default:
      return mockWeekData.monday
  }
}

// Mock data for weekly view
const mockWeeklyData: TimeBlock[] = [
  // Monday
  {
    id: "w1",
    categoryId: "university",
    startTime: createDateString(0, 9, 0),
    endTime: createDateString(0, 12, 0),
    description: "Monday university work",
  },
  {
    id: "w2",
    categoryId: "business",
    startTime: createDateString(0, 14, 0),
    endTime: createDateString(0, 17, 0),
    description: "Monday business work",
  },

  // Tuesday
  {
    id: "w3",
    categoryId: "trw",
    startTime: createDateString(1, 10, 0),
    endTime: createDateString(1, 13, 0),
    description: "Tuesday TRW work",
  },
  {
    id: "w4",
    categoryId: "ai-automation",
    startTime: createDateString(1, 15, 0),
    endTime: createDateString(1, 18, 0),
    description: "Tuesday AI Automation work",
  },

  // Wednesday
  {
    id: "w5",
    categoryId: "university",
    startTime: createDateString(2, 9, 0),
    endTime: createDateString(2, 12, 0),
    description: "Wednesday university work",
  },
  {
    id: "w6",
    categoryId: "business",
    startTime: createDateString(2, 13, 0),
    endTime: createDateString(2, 16, 0),
    description: "Wednesday business work",
  },

  // Thursday
  {
    id: "w7",
    categoryId: "trw",
    startTime: createDateString(3, 10, 0),
    endTime: createDateString(3, 14, 0),
    description: "Thursday TRW work",
  },
  {
    id: "w8",
    categoryId: "ai-automation",
    startTime: createDateString(3, 15, 0),
    endTime: createDateString(3, 19, 0),
    description: "Thursday AI Automation work",
  },

  // Friday
  {
    id: "w9",
    categoryId: "university",
    startTime: createDateString(4, 9, 0),
    endTime: createDateString(4, 11, 0),
    description: "Friday university work",
  },
  {
    id: "w10",
    categoryId: "business",
    startTime: createDateString(4, 13, 0),
    endTime: createDateString(4, 15, 0),
    description: "Friday business work",
  },
  {
    id: "w11",
    categoryId: "trw",
    startTime: createDateString(4, 16, 0),
    endTime: createDateString(4, 18, 0),
    description: "Friday TRW work",
  },
]

// Time Block Modal Component
interface TimeBlockModalProps {
  isOpen: boolean
  onClose: () => void
  block: TimeBlock | null
  onSave: (updatedBlock: TimeBlock) => void
}

function TimeBlockModal({ isOpen, onClose, block, onSave }: TimeBlockModalProps) {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when block changes
  useEffect(() => {
    if (block) {
      setDescription(block.description || "")
    }
  }, [block])

  if (!block) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSave({
        ...block,
        description,
      })
      setIsSubmitting(false)
      onClose()
    }, 500)
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

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case "university":
        return "bg-gradient-to-r from-[#4A78BD] to-[#5D8AC9]"
      case "business":
        return "bg-gradient-to-r from-[#E19A3C] to-[#F0B05C]"
      case "trw":
        return "bg-gradient-to-r from-[#6BB536] to-[#7FC84A]"
      case "ai-automation":
        return "bg-gradient-to-r from-[#A23BC9] to-[#B44FD8]"
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${getCategoryColor(block.categoryId)}`} />
                <h2 className="text-xl font-semibold">{getCategoryName(block.categoryId)}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Time:</span>
                <div>
                  {formatTime(block.startTime)} - {formatTime(block.endTime)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <div>{formatDuration(block.startTime, block.endTime)}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="description" className="mb-2 block">
                  What did you do during this time?
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your activities..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Main Timeline Component
export default function TimelineComponent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 4, 5)) // May 5, 2025 (Monday)
  const [viewType, setViewType] = useState<ViewType>("day")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [hoveredBlock, setHoveredBlock] = useState<TimeBlock | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])
  const [openHoverCardId, setOpenHoverCardId] = useState<string | null>(null)

  // Ref to track if mouse is over a block
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Ref to store the hover timer
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Hover delay in milliseconds
  const HOVER_DELAY = 300

  // Get the appropriate data based on the selected date and view type
  const data = viewType === "day" ? getMockDataForDate(selectedDate) : mockWeeklyData

  // Update timeBlocks when data changes
  useEffect(() => {
    setTimeBlocks(data)
  }, [data])

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

  // Generate time labels based on view type
  const timeLabels =
    viewType === "day" ? Array.from({ length: 19 }, (_, i) => `${i + 6}:00`) : ["Mon", "Tue", "Wed", "Thu", "Fri"]

  // Calculate timeline width and positioning
  const startHour = viewType === "day" ? 6 : 0 // 6am for day view, Monday (0) for week view
  const totalHours = viewType === "day" ? 18 : 5 // 18 hours (6am-midnight) for day, 5 days for week

  // Gap between blocks (in percentage of timeline width)
  const blockGap = 0.2

  const getBlockStyle = (block: TimeBlock) => {
    // For day view, calculate position based on time
    if (viewType === "day") {
      const startTime = new Date(block.startTime)
      const endTime = new Date(block.endTime)

      const startHourDecimal = startTime.getHours() + startTime.getMinutes() / 60
      const endHourDecimal = endTime.getHours() + endTime.getMinutes() / 60

      // Calculate position with gap
      const startPosition = ((startHourDecimal - startHour) / totalHours) * 100

      // Adjust width to account for gap
      const rawWidth = ((endHourDecimal - startHourDecimal) / totalHours) * 100
      const width = Math.max(0, rawWidth - blockGap)

      return {
        left: `${startPosition}%`,
        width: `calc(${width}% - 2px)`,
        margin: "0 1px",
      }
    } else {
      // For week view, calculate position based on day of week
      const startTime = new Date(block.startTime)
      const dayOfWeek = startTime.getDay() - 1 // 0 = Monday
      const startPosition = (dayOfWeek / totalHours) * 100

      // Adjust width to account for gap
      const rawWidth = (1 / totalHours) * 100 // Each day is 1/5 of the timeline
      const width = Math.max(0, rawWidth - blockGap)

      return {
        left: `${startPosition}%`,
        width: `calc(${width}% - 2px)`,
        margin: "0 1px",
      }
    }
  }

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case "university":
        return "linear-gradient(135deg, #4A78BD 0%, #5D8AC9 100%)"
      case "business":
        return "linear-gradient(135deg, #E19A3C 0%, #F0B05C 100%)"
      case "trw":
        return "linear-gradient(135deg, #6BB536 0%, #7FC84A 100%)"
      case "ai-automation":
        return "linear-gradient(135deg, #A23BC9 0%, #B44FD8 100%)"
      case "idle":
        return "linear-gradient(135deg, rgba(245, 245, 245, 0.5) 0%, rgba(235, 235, 235, 0.5) 100%)"
      default:
        return "linear-gradient(135deg, rgba(245, 245, 245, 0.5) 0%, rgba(235, 235, 235, 0.5) 100%)"
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
      <motion.h1 className="text-2xl font-bold" variants={itemVariants}>
        Time Timeline
      </motion.h1>

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

      {/* Timeline View */}
      <motion.div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        layout
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
                  background: "linear-gradient(135deg, rgba(245, 245, 245, 0.5) 0%, rgba(235, 235, 235, 0.5) 100%)",
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
        onSave={handleSaveBlock}
      />
    </motion.div>
  )
}
