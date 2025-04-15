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
    } catch (error) {
      toast.error('Failed to fetch waiting list')
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create waiting list"
      toast.error(`Error: ${message}`)
    }
  }

  useEffect(() => {
    fetchList()
  }, [fetchList])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Toaster />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Waiting List for {today}</h1>
          {!waitingList && (
            <Button onClick={handleCreateList}>
              Create Today's List
            </Button>
          )}
        </div>

        {waitingList ? (
          <>
            <AddPuppyForm onPuppyAdded={fetchList} />
            <WaitingList entries={waitingList.entries} onUpdate={fetchList} />
            {waitingList.entries.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No puppies in the waiting list yet
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No waiting list exists for today. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
