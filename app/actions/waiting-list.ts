'use server'

import { PuppyEntry, WaitingList } from '../types'
import { revalidatePath } from 'next/cache'

let mockWaitingList: WaitingList | null = null

export async function createWaitingList(formData: FormData) {
  mockWaitingList = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    entries: []
  }
  revalidatePath('/')
}

export async function getCurrentWaitingList(): Promise<WaitingList | null> {
  return mockWaitingList
}

export async function addPuppyEntry(entry: Omit<PuppyEntry, 'id' | 'position' | 'status'>) {
  if (!mockWaitingList) return null
  
  const newEntry: PuppyEntry = {
    ...entry,
    id: Date.now().toString(),
    position: mockWaitingList.entries.length + 1,
    status: 'waiting'
  }
  
  mockWaitingList.entries.push(newEntry)
  revalidatePath('/')
  return newEntry
}

export async function updateEntryStatus(entryId: string, status: 'waiting' | 'completed') {
  if (!mockWaitingList) return null
  
  const entry = mockWaitingList.entries.find(e => e.id === entryId)
  if (entry) {
    entry.status = status
    revalidatePath('/')
    return entry
  }
  return null
}

export async function reorderEntries(entries: PuppyEntry[]) {
  if (!mockWaitingList) return null
  
  mockWaitingList.entries = entries.map((entry, index) => ({
    ...entry,
    position: index + 1
  }))
  revalidatePath('/')
  return mockWaitingList.entries
} 