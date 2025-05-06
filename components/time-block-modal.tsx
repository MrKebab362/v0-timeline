"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { TimeBlock, Category } from "@/lib/types"

interface TimeBlockModalProps {
  isOpen: boolean
  onClose: () => void
  block: TimeBlock | null
  categories: Category[]
  onSave: (updatedBlock: TimeBlock) => void
}

export default function TimeBlockModal({ isOpen, onClose, block, categories, onSave }: TimeBlockModalProps) {
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
