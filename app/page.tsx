import { Button } from "@/components/ui/button"
import { AddPuppyForm } from "./components/AddPuppyForm"
import { WaitingList } from "./components/WaitingList"
import { getCurrentWaitingList, createWaitingList } from "./actions/waiting-list"

export default async function Home() {
  const waitingList = await getCurrentWaitingList()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Puppy Waiting List</h1>
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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No waiting list exists for today. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
