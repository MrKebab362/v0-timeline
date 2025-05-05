export type ViewType = "day" | "week"

export interface TimeBlock {
  id: string
  categoryId: string
  startTime: string
  endTime: string
  description?: string
}

export interface Category {
  id: string
  name: string
  color: string
}
