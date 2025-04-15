'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PuppyEntry } from '../types'
import { updateEntryStatus, reorderEntries } from '../actions/waiting-list'

interface WaitingListProps {
  entries: PuppyEntry[]
  onUpdate?: () => void
}

export function WaitingList({ entries: initialEntries, onUpdate }: WaitingListProps) {
  const [entries, setEntries] = useState<PuppyEntry[]>(() => {
    return [...initialEntries].sort((a, b) => {
      // First sort by status (completed entries go to bottom)
      if (a.status.toUpperCase() === 'COMPLETED' && b.status.toUpperCase() !== 'COMPLETED') return 1;
      if (a.status.toUpperCase() !== 'COMPLETED' && b.status.toUpperCase() === 'COMPLETED') return -1;
      // Then sort by position for entries with same status
      return a.position - b.position;
    });
  });

  const [draggedItem, setDraggedItem] = useState<PuppyEntry | null>(null)

  useEffect(() => {
    const sortedEntries = [...initialEntries].sort((a, b) => {
      if (a.status.toUpperCase() === 'COMPLETED' && b.status.toUpperCase() !== 'COMPLETED') return 1;
      if (a.status.toUpperCase() !== 'COMPLETED' && b.status.toUpperCase() === 'COMPLETED') return -1;
      return a.position - b.position;
    });
    setEntries(sortedEntries);
  }, [initialEntries]);

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
      const newPosition = entries.findIndex(e => e.id === draggedItem.id)
      await reorderEntries(Number(draggedItem.id), newPosition)
      setDraggedItem(null)
    }
  }

  const handleStatusChange = async (entryId: string) => {
    try {
      await updateEntryStatus(Number(entryId), 'COMPLETED' as const)
      // Notify parent to refresh the list
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        return (
          <Card
            key={entry.id}
            className={`p-3 lg:p-4 cursor-move touch-none ${
              entry.status.toUpperCase() === 'COMPLETED' ? 'opacity-50' : ''
            }`}
            draggable
            onDragStart={() => handleDragStart(entry)}
            onDragOver={(e) => handleDragOver(e, entry)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex-grow">
                <h3 className="font-medium text-base mb-2">{entry.puppyName}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-500">
                  <div>Owner: {entry.ownerName}</div>
                  <div>Service: {entry.service}</div>
                  <div className="col-span-2 lg:col-span-1">
                    Arrived: {new Date(entry.arrivalTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              {entry.status.toUpperCase() === 'WAITING' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(entry.id)}
                  className="w-full lg:w-auto text-sm whitespace-nowrap"
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  )
} 