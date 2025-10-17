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

interface CriminalRecord {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  national_id: string | null
  gender: string | null
  address: string | null
  status: string
}

interface EditCriminalRecordDialogProps {
  record: CriminalRecord
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCriminalRecordDialog({ record, open, onOpenChange }: EditCriminalRecordDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase
      .from("criminal_records")
      .update({
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        date_of_birth: formData.get("date_of_birth") as string,
        national_id: formData.get("national_id") as string,
        gender: formData.get("gender") as string,
        address: formData.get("address") as string,
        status: formData.get("status") as string,
      })
      .eq("id", record.id)

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
          <DialogTitle>Edit Criminal Record</DialogTitle>
          <DialogDescription className="text-slate-400">Update the details of the criminal record.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_first_name">First Name</Label>
              <Input
                id="edit_first_name"
                name="first_name"
                defaultValue={record.first_name}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_last_name">Last Name</Label>
              <Input
                id="edit_last_name"
                name="last_name"
                defaultValue={record.last_name}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_date_of_birth">Date of Birth</Label>
              <Input
                id="edit_date_of_birth"
                name="date_of_birth"
                type="date"
                defaultValue={record.date_of_birth}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_national_id">National ID</Label>
              <Input
                id="edit_national_id"
                name="national_id"
                defaultValue={record.national_id || ""}
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_gender">Gender</Label>
              <Select name="gender" defaultValue={record.gender || ""} required>
                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select name="status" defaultValue={record.status} required>
                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="sealed">Sealed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_address">Address</Label>
            <Textarea
              id="edit_address"
              name="address"
              defaultValue={record.address || ""}
              className="border-slate-700 bg-slate-800/50 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Updating..." : "Update Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
