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

export function AddPuppyForm() {
  const [open, setOpen] = useState(false)
  const [puppyName, setPuppyName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [service, setService] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const currentTime = new Date().toLocaleTimeString()
    
    await addPuppyEntry({
      puppyName,
      ownerName,
      service,
      arrivalTime: currentTime,
    })

    setPuppyName('')
    setOwnerName('')
    setService('')
  }

  return (
    <Card className="p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="puppyName">Puppy Name</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between w-full"
              >
                {puppyName || "Select puppy name..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search puppy name..." />
                <CommandEmpty>No puppy name found.</CommandEmpty>
                <CommandGroup>
                  {PUPPY_NAMES.map((name) => (
                    <CommandItem
                      key={name}
                      onSelect={(currentValue: string) => {
                        setPuppyName(currentValue)
                        setOpen(false)
                      }}
                    >
                      {name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            value={ownerName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOwnerName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="service">Service Requested</Label>
          <Input
            id="service"
            value={service}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setService(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Add to Waiting List
        </Button>
      </form>
    </Card>
  )
} 