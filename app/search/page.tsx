'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PuppyEntry } from '../types'
import { searchEntries } from '../actions/waiting-list'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<PuppyEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await searchEntries(searchQuery)
        setResults(data)
      } catch (err) {
        setError('Failed to fetch search results')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Puppies Search</h1>
        
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search puppies by name or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading && (
          <p className="text-center text-gray-500 py-4">Loading...</p>
        )}

        {error && (
          <p className="text-center text-red-500 py-4">{error}</p>
        )}

        <div className="space-y-4">
          {results.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{entry.puppyName}</h3>
                  <p className="text-sm text-gray-500">Owner: {entry.ownerName}</p>
                  <p className="text-sm text-gray-500">Service: {entry.serviceRequired}</p>
                  <p className="text-sm text-gray-500">Status: {entry.status}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {new Date(entry.arrivalTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}

          {!loading && searchQuery && results.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No puppies found matching &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 