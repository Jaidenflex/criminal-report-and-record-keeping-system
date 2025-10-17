"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface CriminalRecord {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  national_id: string | null
  gender: string | null
  address: string | null
  status: string
  created_at: string
}

interface ViewCriminalRecordDialogProps {
  record: CriminalRecord
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCriminalRecordDialog({ record, open, onOpenChange }: ViewCriminalRecordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criminal Record Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">First Name</p>
              <p className="font-medium">{record.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Last Name</p>
              <p className="font-medium">{record.last_name}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Date of Birth</p>
              <p className="font-medium">{new Date(record.date_of_birth).toLocaleDateString("en-GB")}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">National ID</p>
              <p className="font-medium">{record.national_id || "N/A"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Gender</p>
              <p className="font-medium">{record.gender || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <Badge
                variant={record.status === "active" ? "default" : "secondary"}
                className={
                  record.status === "active"
                    ? "bg-green-500/10 text-green-500"
                    : record.status === "archived"
                      ? "bg-slate-500/10 text-slate-400"
                      : "bg-yellow-500/10 text-yellow-500"
                }
              >
                {record.status}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400">Address</p>
            <p className="font-medium">{record.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Record Created</p>
            <p className="font-medium">{new Date(record.created_at).toLocaleString("en-GB")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
