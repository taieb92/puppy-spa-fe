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
      } catch (error) {
        setError('Failed to load calendar data')
        console.error('Failed to load calendar data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusyDates()
  }, [date])

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
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
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
    <div className="container mx-auto py-4 px-2 lg:py-8 lg:px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-8">Calendar View</h1>
        
        {error && (
          <div className="mb-4 p-3 lg:p-4 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <Card className="p-2 lg:p-4 min-h-[350px] flex flex-col">
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
                day_today: 'bg-gray-100 font-bold',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                caption: 'flex justify-center pt-1 relative items-center text-sm font-medium',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-slate-500 rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-violet-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
              }}
              className="mx-auto"
              components={{
                DayContent: ({ date: dayDate }) => {
                  const isBusy = busyDates.some(
                    busyDate => 
                      busyDate.getDate() === dayDate.getDate() &&
                      busyDate.getMonth() === dayDate.getMonth() &&
                      busyDate.getFullYear() === dayDate.getFullYear()
                  )

                  return (
                    <div className="relative w-full h-full flex items-center justify-center text-sm">
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

          <Card className="p-3 lg:p-4 min-h-[350px] flex flex-col">
            <h2 className="text-lg lg:text-xl font-semibold mb-3">
              {date ? format(date, 'EEEE, MMMM d, yyyy') : 'Select a date'}
            </h2>
            
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-3 flex-grow">
                {entries.length > 0 ? (
                  <>
                    <p className="text-sm font-medium text-violet-600">
                      {entries.length} appointment{entries.length !== 1 ? 's' : ''} scheduled
                    </p>
                    <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-450px)] lg:max-h-[280px]">
                      {entries.map((entry) => (
                        <div 
                          key={entry.id} 
                          className={cn(
                            "p-3 rounded-md text-sm",
                            entry.status === 'COMPLETED' 
                              ? "bg-green-50 text-green-900" 
                              : "bg-violet-50 text-violet-900"
                          )}
                        >
                          <div className="font-medium">{entry.puppyName}</div>
                          <div className="mt-1 space-y-0.5">
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