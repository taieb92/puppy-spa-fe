'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { PUPPY_NAMES } from '../types'
import { addPuppyEntry } from '../actions/waiting-list'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { toast } from "sonner"

interface AddPuppyFormProps {
  onPuppyAdded: () => void;
}

export function AddPuppyForm({ onPuppyAdded }: AddPuppyFormProps) {
  const [open, setOpen] = useState(false)
  const [puppyName, setPuppyName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [service, setService] = useState('')
  const [arrivalTime, setArrivalTime] = useState(() => {
    const now = new Date()
    return format(now, 'HH:mm')
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Combine today's date with selected time
      const today = new Date()
      const [hours, minutes] = arrivalTime.split(':')
      today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
      const isoTime = today.toISOString()
      
      await addPuppyEntry({
        puppyName,
        ownerName,
        serviceRequired: service,
        arrivalTime: isoTime,
      })

      setPuppyName('')
      setOwnerName('')
      setService('')
      // Reset arrival time to current time
      const now = new Date()
      setArrivalTime(format(now, 'HH:mm'))
      
      toast.success('Puppy added successfully')
      onPuppyAdded() // Call the callback to refresh the list
    } catch (error) {
      toast.error('Failed to add puppy')
    }
  }

  return (
    <Card className="p-3 lg:p-4 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="puppyName" className="text-sm font-medium">Puppy Name</Label>
          <div className="relative">
            <Input
              id="puppyName"
              value={puppyName}
              onChange={(e) => setPuppyName(e.target.value)}
              required
              className="w-full pr-24 text-sm"
              placeholder="Enter puppy name"
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="absolute right-0 top-0 h-full text-sm px-3"
                >
                  Suggestions
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search puppy name..." className="text-sm" />
                  <CommandEmpty className="text-sm p-2">No puppy name found.</CommandEmpty>
                  <CommandGroup>
                    {PUPPY_NAMES.map((name) => (
                      <CommandItem
                        key={name}
                        onSelect={(currentValue: string) => {
                          setPuppyName(currentValue)
                          setOpen(false)
                        }}
                        className="text-sm"
                      >
                        {name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ownerName" className="text-sm font-medium">Owner Name</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="text-sm"
              placeholder="Enter owner name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service" className="text-sm font-medium">Service Required</Label>
            <Input
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="text-sm"
              placeholder="Enter service type"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="arrivalTime" className="text-sm font-medium">Arrival Time</Label>
          <Input
            id="arrivalTime"
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
            className="text-sm w-full md:w-[200px]"
          />
        </div>

        <Button type="submit" className="w-full md:w-auto text-sm">
          Add to Waiting List
        </Button>
      </form>
    </Card>
  )
} 