import type React from "react"
import { StudentSidebar } from "@/components/student-sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <div className="lg:pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
