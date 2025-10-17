"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Investigation {
  id: string
  title: string
  description: string
  status: string
  priority: string
  start_date: string
  end_date: string | null
  findings: string | null
  crimes?: {
    crime_type: string
    location: string
  } | null
  profiles?: {
    full_name: string
  } | null
}

interface ViewInvestigationDialogProps {
  investigation: Investigation
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewInvestigationDialog({ investigation, open, onOpenChange }: ViewInvestigationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Investigation Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Title</p>
            <p className="font-medium text-lg">{investigation.title}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Description</p>
            <p className="font-medium">{investigation.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Related Crime</p>
              <p className="font-medium">
                {investigation.crimes ? `${investigation.crimes.crime_type} - ${investigation.crimes.location}` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Lead Officer</p>
              <p className="font-medium">{investigation.profiles?.full_name || "Unassigned"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Priority</p>
              <Badge
                className={
                  investigation.priority === "High"
                    ? "bg-red-500/10 text-red-500"
                    : investigation.priority === "Medium"
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-blue-500/10 text-blue-500"
                }
              >
                {investigation.priority}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <Badge
                className={
                  investigation.status === "pending"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : investigation.status === "active"
                      ? "bg-blue-500/10 text-blue-500"
                      : investigation.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-slate-500/10 text-slate-400"
                }
              >
                {investigation.status}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Start Date</p>
              <p className="font-medium">{new Date(investigation.start_date).toLocaleDateString("en-GB")}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">End Date</p>
              <p className="font-medium">
                {investigation.end_date ? new Date(investigation.end_date).toLocaleDateString("en-GB") : "Ongoing"}
              </p>
            </div>
          </div>
          {investigation.findings && (
            <div>
              <p className="text-sm text-slate-400">Findings</p>
              <p className="font-medium">{investigation.findings}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
