'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarDays, Search, ListTodo } from "lucide-react"

const navigation = [
  { name: 'Today', href: '/', icon: ListTodo },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  { name: 'Puppies Search', href: '/search', icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[200px] flex-col bg-muted/20">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Puppy List</h2>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 