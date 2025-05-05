import type { TimeBlock, Category } from "./types"
import { addDays } from "date-fns"

// Define categories with professional colors and gradients
export const categories: Category[] = [
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
    color: "#E8E8E8", // Light gray (will be overridden in the component)
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
export const mockWeekData = {
  monday: generateMondayData(),
  tuesday: generateTuesdayData(),
  wednesday: generateWednesdayData(),
  thursday: generateThursdayData(),
  friday: generateFridayData(),
  saturday: generateSaturdayData(),
  sunday: generateSundayData(),
}

// Helper function to get data for a specific date
export const getMockDataForDate = (date: Date): TimeBlock[] => {
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

// For backward compatibility
export const mockDailyData = mockWeekData.monday

// Mock data for weekly view
export const mockWeeklyData: TimeBlock[] = [
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
