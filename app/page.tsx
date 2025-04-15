'use client'

import { Button } from "@/components/ui/button"
import { AddPuppyForm } from "./components/AddPuppyForm"
import { WaitingList } from "./components/WaitingList"
import { getCurrentWaitingList, createWaitingList } from "./actions/waiting-list"
import { format } from "date-fns"
import { useEffect, useState, useCallback } from "react"
import { WaitingList as WaitingListType } from "./types"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function Home() {
  const today = format(new Date(), 'MMMM d, yyyy')
  const [waitingList, setWaitingList] = useState<WaitingListType | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchList = useCallback(async () => {
    try {
      const list = await getCurrentWaitingList()
      setWaitingList(list)
    } catch (err) {
      toast.error('Failed to fetch waiting list')
      console.error('Failed to fetch waiting list:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCreateList = async () => {
    try {
      const list = await createWaitingList()
      if (list) {
        setWaitingList(list)
        toast.success('Waiting list created successfully')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create waiting list"
      toast.error(`Error: ${message}`)
      console.error('Failed to create waiting list:', err)
    }
  }

  useEffect(() => {
    fetchList()
  }, [fetchList])

  if (loading) {
    return (
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm sm:text-base text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Toaster />
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8 mb-4 sm:mb-8 mt-12 lg:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Waiting List for {today}</h1>
          {!waitingList && (
            <Button onClick={handleCreateList} className="w-full sm:w-auto">
              Create Today&apos;s List
            </Button>
          )}
        </div>

        {waitingList ? (
          <>
            <AddPuppyForm onPuppyAdded={fetchList} />
            <WaitingList entries={waitingList.entries} onUpdate={fetchList} />
            {waitingList.entries.length === 0 && (
              <p className="text-center text-xs sm:text-sm text-gray-500 py-6 sm:py-8">
                No puppies in the waiting list yet
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-xs sm:text-sm text-gray-500">
              No waiting list exists for today. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
