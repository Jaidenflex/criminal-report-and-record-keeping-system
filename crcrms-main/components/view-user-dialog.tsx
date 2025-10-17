"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  badge_number: string | null
  department: string | null
  phone: string | null
  created_at: string
}

interface ViewUserDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewUserDialog({ user, open, onOpenChange }: ViewUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Full Name</p>
              <p className="font-medium">{user.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Role</p>
              <Badge
                className={
                  user.role === "admin"
                    ? "bg-purple-500/10 text-purple-500"
                    : user.role === "officer"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-slate-500/10 text-slate-400"
                }
              >
                {user.role}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-400">Phone</p>
              <p className="font-medium">{user.phone || "N/A"}</p>
            </div>
          </div>
          {user.role === "officer" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Badge Number</p>
                <p className="font-medium">{user.badge_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Department</p>
                <p className="font-medium">{user.department || "N/A"}</p>
              </div>
            </div>
          )}
          <div>
            <p className="text-sm text-slate-400">Account Created</p>
            <p className="font-medium">{new Date(user.created_at).toLocaleString("en-GB")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
