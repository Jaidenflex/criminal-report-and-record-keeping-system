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

interface Investigation {
  id: string
  title: string
  description: string
  status: string
  priority: string
  findings: string | null
  end_date: string | null
}

interface EditInvestigationDialogProps {
  investigation: Investigation
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditInvestigationDialog({ investigation, open, onOpenChange }: EditInvestigationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const updateData: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      status: formData.get("status") as string,
      findings: formData.get("findings") as string,
    }

    if (formData.get("end_date")) {
      updateData.end_date = formData.get("end_date") as string
    }

    const { error } = await supabase.from("investigations").update(updateData).eq("id", investigation.id)

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
          <DialogTitle>Edit Investigation</DialogTitle>
          <DialogDescription className="text-slate-400">Update the investigation details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_title">Investigation Title</Label>
            <Input
              id="edit_title"
              name="title"
              defaultValue={investigation.title}
              required
              className="border-slate-700 bg-slate-800/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_description">Description</Label>
            <Textarea
              id="edit_description"
              name="description"
              defaultValue={investigation.description}
              required
              className="border-slate-700 bg-slate-800/50 text-white min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_priority">Priority</Label>
              <Select name="priority" defaultValue={investigation.priority} required>
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
              <Select name="status" defaultValue={investigation.status} required>
                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_end_date">End Date (Optional)</Label>
            <Input
              id="edit_end_date"
              name="end_date"
              type="date"
              defaultValue={investigation.end_date || ""}
              className="border-slate-700 bg-slate-800/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_findings">Findings</Label>
            <Textarea
              id="edit_findings"
              name="findings"
              defaultValue={investigation.findings || ""}
              placeholder="Investigation findings and conclusions"
              className="border-slate-700 bg-slate-800/50 text-white min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Updating..." : "Update Investigation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
