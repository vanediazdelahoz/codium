"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CodiumLogo } from "@/components/codium-logo"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut, Menu, X } from "lucide-react"

const menuItems = [{ icon: BookOpen, label: "Mis Cursos", href: "/student" }]

export function StudentSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-border">
          <CodiumLogo />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar sesión
            </Button>
          </Link>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
