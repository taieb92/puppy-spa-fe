import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Calendar | Puppy Spa",
  description: "View and manage your puppy spa appointments calendar. See busy days and appointment details at a glance.",
  openGraph: {
    title: "Calendar | Puppy Spa",
    description: "View and manage your puppy spa appointments calendar. See busy days and appointment details at a glance."
  }
}

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 