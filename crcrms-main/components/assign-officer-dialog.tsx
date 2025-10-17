"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Crime {
  id: string
  crime_type: string
  description: string
  location: string
  date_occurred: string
  status: string
  severity: string
  assigned_officer: string | null
  admin_notes?: string | null
}

interface Officer {
  id: string
  full_name: string
  badge_number: string | null
}

interface AssignOfficerDialogProps {
  crime: Crime
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignOfficerDialog({ crime, open, onOpenChange }: AssignOfficerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [officers, setOfficers] = useState<Officer[]>([])
  const [selectedOfficer, setSelectedOfficer] = useState<string>(crime.assigned_officer || "")
  const [selectedStatus, setSelectedStatus] = useState<string>(crime.status || "reported")
  const [adminNotes, setAdminNotes] = useState<string>(crime.admin_notes || "")
  const router = useRouter()

  useEffect(() => {
    const fetchOfficers = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("id, full_name, badge_number").eq("role", "officer")
      setOfficers(data || [])
    }
    if (open) {
      fetchOfficers()
      setSelectedOfficer(crime.assigned_officer || "")
      setSelectedStatus(crime.status || "reported")
      setAdminNotes(crime.admin_notes || "")
    }
  }, [open, crime])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    const updateData: any = {
      assigned_officer: selectedOfficer,
      status: selectedStatus,
    }

    if (adminNotes.trim()) {
      updateData.admin_notes = adminNotes
    }

    const { data, error } = await supabase.from("crimes").update(updateData).eq("id", crime.id).select()

    setIsLoading(false)

    if (error) {
      console.error("[v0] Error assigning officer:", error)
      alert(`Error: ${error.message}`)
    } else {
      onOpenChange(false)
      router.refresh()
      alert("Officer assigned successfully!")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-200 bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#1c1c84]">Assign Officer to Crime Report</DialogTitle>
          <DialogDescription className="text-gray-600">
            Assign an officer and update the status of this crime report.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crime_details" className="text-gray-700">
              Crime Details
            </Label>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
              <p className="font-medium text-gray-900">{crime.crime_type}</p>
              <p className="text-gray-600">{crime.location}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(crime.date_occurred).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_officer" className="text-gray-700">
              Assign Officer
            </Label>
            <Select value={selectedOfficer} onValueChange={setSelectedOfficer} required>
              <SelectTrigger className="border-gray-300 bg-white focus:border-[#1c1c84] focus:ring-[#1c1c84]">
                <SelectValue placeholder="Select an officer" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {officers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id} className="hover:bg-gray-100">
                    {officer.full_name} {officer.badge_number ? `(${officer.badge_number})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700">
              Update Status
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus} required>
              <SelectTrigger className="border-gray-300 bg-white focus:border-[#1c1c84] focus:ring-[#1c1c84]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="reported" className="hover:bg-gray-100">
                  Reported
                </SelectItem>
                <SelectItem value="under_investigation" className="hover:bg-gray-100">
                  Under Investigation
                </SelectItem>
                <SelectItem value="solved" className="hover:bg-gray-100">
                  Solved
                </SelectItem>
                <SelectItem value="closed" className="hover:bg-gray-100">
                  Closed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_notes" className="text-gray-700">
              Instructions for Officer
            </Label>
            <Textarea
              id="admin_notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add instructions or notes for the assigned officer..."
              className="border-gray-300 bg-white min-h-[100px] focus:border-[#1c1c84] focus:ring-[#1c1c84]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedOfficer}
              className="bg-[#1c1c84] text-white hover:bg-[#1c1c84]/90"
            >
              {isLoading ? "Assigning..." : "Assign Officer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
