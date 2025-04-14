'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PuppyEntry } from '../types'
import { updateEntryStatus, reorderEntries } from '../actions/waiting-list'

interface WaitingListProps {
  entries: PuppyEntry[]
}

export function WaitingList({ entries: initialEntries }: WaitingListProps) {
  const [entries, setEntries] = useState<PuppyEntry[]>(initialEntries)
  const [draggedItem, setDraggedItem] = useState<PuppyEntry | null>(null)

  useEffect(() => {
    setEntries(initialEntries)
  }, [initialEntries])

  const handleDragStart = (entry: PuppyEntry) => {
    setDraggedItem(entry)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetEntry: PuppyEntry) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetEntry.id) return

    const newEntries = [...entries]
    const draggedIndex = entries.findIndex(e => e.id === draggedItem.id)
    const targetIndex = entries.findIndex(e => e.id === targetEntry.id)

    newEntries.splice(draggedIndex, 1)
    newEntries.splice(targetIndex, 0, draggedItem)

    setEntries(newEntries)
  }

  const handleDragEnd = async () => {
    if (draggedItem) {
      await reorderEntries(entries)
      setDraggedItem(null)
    }
  }

  const handleStatusChange = async (entryId: string) => {
    await updateEntryStatus(entryId, 'completed')
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className={`p-4 cursor-move ${
            entry.status === 'completed' ? 'opacity-50' : ''
          }`}
          draggable
          onDragStart={() => handleDragStart(entry)}
          onDragOver={(e) => handleDragOver(e, entry)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{entry.puppyName}</h3>
              <p className="text-sm text-gray-500">Owner: {entry.ownerName}</p>
              <p className="text-sm text-gray-500">Service: {entry.service}</p>
              <p className="text-sm text-gray-500">Arrived: {entry.arrivalTime}</p>
            </div>
            {entry.status === 'waiting' && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange(entry.id)}
              >
                Mark Complete
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
} 