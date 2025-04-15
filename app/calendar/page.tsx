'use client'

import { useState, useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { format } from 'date-fns'
import { getMonthBusyDates, getEntriesByDate } from '../actions/waiting-list'
import type { PuppyEntry } from '../types/index'
import { cn } from '@/lib/utils'

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [busyDates, setBusyDates] = useState<Date[]>([])
  const [entries, setEntries] = useState<PuppyEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch busy dates for the current month
  useEffect(() => {
    const fetchBusyDates = async () => {
      if (!date) return

      try {
        setLoading(true)
        setError(null)
        const yearMonth = format(date, 'yyyy-MM')
        const data = await getMonthBusyDates(yearMonth)
        // API returns an object with dates array
        const dates = (data.dates || []).map((dateStr: string) => new Date(dateStr))
        setBusyDates(dates)
      } catch (err) {
        setError('Failed to load calendar data')
      } finally {
        setLoading(false)
      }
    }

    fetchBusyDates()
  }, [date?.getMonth(), date?.getFullYear()])

  // Fetch entries when a date is selected
  useEffect(() => {
    const fetchEntries = async () => {
      if (!date) return

      try {
        setLoading(true)
        setError(null)
        const formattedDate = format(date, 'yyyy-MM-dd')
        const data = await getEntriesByDate(formattedDate)
        setEntries(data)
      } catch (err) {
        // Check if it's a 404 error
        if (err instanceof Error && err.message.includes('404')) {
          // Treat 404 as empty list
          setEntries([])
        } else {
          setError('Failed to load appointments')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [date])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Calendar View</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{
                busy: busyDates
              }}
              modifiersStyles={{
                busy: {
                  backgroundColor: '#EDE9FE',
                  color: '#5B21B6',
                  fontWeight: 'bold'
                }
              }}
              classNames={{
                day_selected: 'bg-violet-600 text-white hover:bg-violet-500',
                day_today: 'bg-gray-100 font-bold'
              }}
              className="rounded-md border"
              disabled={{ before: new Date() }}
              components={{
                DayContent: ({ date: dayDate }) => {
                  const isBusy = busyDates.some(
                    busyDate => 
                      busyDate.getDate() === dayDate.getDate() &&
                      busyDate.getMonth() === dayDate.getMonth() &&
                      busyDate.getFullYear() === dayDate.getFullYear()
                  )

                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {dayDate.getDate()}
                      {isBusy && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="h-1 w-1 rounded-full bg-violet-600"></div>
                        </div>
                      )}
                    </div>
                  )
                }
              }}
            />
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {date ? format(date, 'EEEE, MMMM d, yyyy') : 'Select a date'}
            </h2>
            
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                {entries.length > 0 ? (
                  <>
                    <p className="text-sm font-medium text-violet-600">
                      {entries.length} appointment{entries.length !== 1 ? 's' : ''} scheduled
                    </p>
                    <div className="space-y-3">
                      {entries.map((entry) => (
                        <div 
                          key={entry.id} 
                          className={cn(
                            "p-3 rounded-md",
                            entry.status === 'COMPLETED' 
                              ? "bg-green-50 text-green-900" 
                              : "bg-violet-50 text-violet-900"
                          )}
                        >
                          <div className="font-medium">{entry.puppyName}</div>
                          <div className="text-sm opacity-90">
                            <div>Owner: {entry.ownerName}</div>
                            <div>Service: {entry.service}</div>
                            <div>Time: {new Date(entry.arrivalTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}</div>
                            <div>Status: {entry.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    No appointments scheduled for this date
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 