'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PUPPY_NAMES } from '../types'

interface SearchResult {
  puppyName: string
  lastVisit: string
  totalVisits: number
  commonService: string
}

// Mock data - in real app, this would come from API
const mockPuppyHistory: SearchResult[] = [
  {
    puppyName: 'Max',
    lastVisit: '2024-03-15',
    totalVisits: 5,
    commonService: 'Grooming'
  },
  {
    puppyName: 'Luna',
    lastVisit: '2024-03-10',
    totalVisits: 3,
    commonService: 'Check-up'
  },
  // Add more mock data as needed
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredResults = mockPuppyHistory.filter(result =>
    result.puppyName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Puppies Search</h1>
        
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search puppies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="space-y-4">
          {filteredResults.map((result) => (
            <Card key={result.puppyName} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{result.puppyName}</h3>
                  <p className="text-sm text-gray-500">Last visit: {result.lastVisit}</p>
                  <p className="text-sm text-gray-500">Total visits: {result.totalVisits}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {result.commonService}
                  </span>
                </div>
              </div>
            </Card>
          ))}

          {searchQuery && filteredResults.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No puppies found matching "{searchQuery}"
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 