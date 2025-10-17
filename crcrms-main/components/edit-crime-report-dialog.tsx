"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  witness_info: string | null
}

interface EditCrimeReportDialogProps {
  crime: Crime
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCrimeReportDialog({ crime, open, onOpenChange }: EditCrimeReportDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase
      .from("crimes")
      .update({
        crime_type: formData.get("crime_type") as string,
        description: formData.get("description") as string,
        location: formData.get("location") as string,
        date_occurred: formData.get("date_occurred") as string,
        severity: formData.get("severity") as string,
        status: formData.get("status") as string,
        witness_info: formData.get("witness_info") as string,
      })
      .eq("id", crime.id)

    setIsLoading(false)

    if (!error) {
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Crime Report</DialogTitle>
          <DialogDescription className="text-slate-400">Update the details of the crime report.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_crime_type">Crime Type</Label>
            <Input
              id="edit_crime_type"
              name="crime_type"
              defaultValue={crime.crime_type}
              required
              className="border-slate-700 bg-slate-800/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_description">Description</Label>
            <Textarea
              id="edit_description"
              name="description"
              defaultValue={crime.description}
              required
              className="border-slate-700 bg-slate-800/50 text-white min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_location">Location</Label>
              <Input
                id="edit_location"
                name="location"
                defaultValue={crime.location}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_date_occurred">Date Occurred</Label>
              <Input
                id="edit_date_occurred"
                name="date_occurred"
                type="datetime-local"
                defaultValue={crime.date_occurred.slice(0, 16)}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_severity">Severity</Label>
              <Select name="severity" defaultValue={crime.severity} required>
                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select name="status" defaultValue={crime.status} required>
                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="under_investigation">Under Investigation</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_witness_info">Witness Information</Label>
            <Textarea
              id="edit_witness_info"
              name="witness_info"
              defaultValue={crime.witness_info || ""}
              className="border-slate-700 bg-slate-800/50 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Updating..." : "Update Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
