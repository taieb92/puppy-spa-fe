import { Button } from "@/components/ui/button"
import { AddPuppyForm } from "./components/AddPuppyForm"
import { WaitingList } from "./components/WaitingList"
import { getCurrentWaitingList, createWaitingList } from "./actions/waiting-list"

export default async function Home() {
  const waitingList = await getCurrentWaitingList()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Today's Waiting List</h1>
          {!waitingList && (
            <form action={createWaitingList}>
              <Button type="submit">
                Create Today's List
              </Button>
            </form>
          )}
        </div>

        {waitingList ? (
          <>
            <AddPuppyForm />
            <WaitingList entries={waitingList.entries} />
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
