'use client'

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock data - in real app, this would come from API
  const busyDates = [
    new Date(2024, 2, 15),
    new Date(2024, 2, 16),
    new Date(2024, 2, 20),
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Calendar View</h1>
        
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
                busy: { fontWeight: 'bold', textDecoration: 'underline' }
              }}
              className="rounded-md border"
            />
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {date ? date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Select a date'}
            </h2>
            
            {date && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {busyDates.some(d => d.toDateString() === date.toDateString())
                    ? '5 appointments scheduled'
                    : 'No appointments scheduled'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 