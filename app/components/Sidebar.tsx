'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarDays, Search, ListTodo, Menu, X } from "lucide-react"
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"

const navigation = [
  { name: 'Today', href: '/', icon: ListTodo },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  { name: 'Puppies Search', href: '/search', icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close the mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const NavItems = () => (
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
  )

  return (
    <>
      {/* Mobile Burger Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Puppy List</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <NavItems />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-[200px] flex-col bg-muted/20">
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Puppy List</h2>
          <NavItems />
        </div>
      </div>
    </>
  )
} 