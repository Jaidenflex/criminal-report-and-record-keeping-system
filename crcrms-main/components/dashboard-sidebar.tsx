"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  AlertCircle,
  Search,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const getNavigationForRole = (role: string) => {
  const baseNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "officer", "public"] },
  ]

  const adminNav = [
    { name: "Criminal Records", href: "/dashboard/criminal-records", icon: FileText, roles: ["admin", "officer"] },
    {
      name: "Crime Reports",
      href: "/dashboard/crime-reports",
      icon: AlertCircle,
      roles: ["admin", "officer", "public"],
    },
    { name: "Investigations", href: "/dashboard/investigations", icon: Search, roles: ["admin", "officer"] },
    { name: "Officers", href: "/dashboard/officers", icon: UserPlus, roles: ["admin"] },
    { name: "Users", href: "/dashboard/users", icon: Users, roles: ["admin"] },
    { name: "Audit Logs", href: "/dashboard/audit-logs", icon: ClipboardList, roles: ["admin"] },
  ]

  return [...baseNav, ...adminNav].filter((item) => item.roles.includes(role))
}

interface DashboardSidebarProps {
  userRole: string
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [navigation, setNavigation] = useState(getNavigationForRole(userRole))

  useEffect(() => {
    setNavigation(getNavigationForRole(userRole))
  }, [userRole])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <Image src="/images/crcrms-logo.jpeg" alt="CRCRMS Logo" width={32} height={32} className="rounded-md" />
        <span className="text-xl font-bold text-white">CRCRMS</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                isActive ? "bg-[#EAB308] text-gray-900" : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 border-r border-gray-800 bg-gray-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-gray-800 bg-gray-900 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
