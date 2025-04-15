'use server'

import { PuppyEntry, WaitingList } from '../types'
import { revalidatePath } from 'next/cache'
import { format } from 'date-fns'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function createWaitingList() {
  try {
    const today = format(new Date(), 'yyyy-MM-dd')
    const response = await fetch(`${API_BASE_URL}/api/waiting-lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: today }),
    })

    if (!response.ok) {
      if (response.status === 409) {
        // If list exists, fetch and return it instead of throwing an error
        return getCurrentWaitingList()
      }
      throw new Error('Failed to create waiting list')
    }

    revalidatePath('/')
    const result = await response.json()
    return { entries: [] } // New list starts empty
  } catch (error) {
    console.error('Error creating waiting list:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to create waiting list: ${error.message}`)
    }
    throw error
  }
}

export async function getCurrentWaitingList(): Promise<WaitingList | null> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd')
    const url = `${API_BASE_URL}/api/entries/list?date=${today}`
    
    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch waiting list: ${response.status} ${response.statusText}`)
    }

    const entries = await response.json()
    return { entries }
  } catch (error) {
    throw error
  }
}

type NewPuppyEntry = {
  puppyName: string;
  ownerName: string;
  serviceRequired: string;
  arrivalTime: string;
}

export async function addPuppyEntry(entry: NewPuppyEntry) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) {
      throw new Error(`Failed to add puppy entry: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    revalidatePath('/')
    return responseData
  } catch (error) {
    throw error
  }
}

export async function updateEntryStatus(entryId: number, status: 'COMPLETED' | 'WAITING') {
  try {
    const url = `${API_BASE_URL}/api/entries/${entryId}/status`
    const body = { status }
    
    console.log('Updating entry status:', {
      url,
      method: 'PUT',
      body,
      API_BASE_URL
    })
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Failed to update entry status: ${response.status} ${response.statusText}`)
    }

    revalidatePath('/')
    return await response.json()
  } catch (error) {
    console.error('Error updating entry status:', error)
    throw error
  }
}

export async function reorderEntries(entryId: number, newPosition: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/entries/${entryId}/position`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position: newPosition }),
    })

    if (!response.ok) {
      throw new Error('Failed to reorder entry')
    }

    revalidatePath('/')
    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function searchEntries(query: string) {
  try {
    const url = `${API_BASE_URL}/api/entries/list?q=${encodeURIComponent(query)}`
    console.log('Search request:', {
      url,
      API_BASE_URL,
      query,
      encodedQuery: encodeURIComponent(query)
    })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    console.log('Search response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Search error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Failed to search entries: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Search results:', {
      resultCount: Array.isArray(data) ? data.length : 'not an array',
      data
    })

    return data
  } catch (error) {
    console.error('Error searching entries:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
} 