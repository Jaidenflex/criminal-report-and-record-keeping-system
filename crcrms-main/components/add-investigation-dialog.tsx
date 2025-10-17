"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AddInvestigationDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [crimes, setCrimes] = useState<any[]>([])
  const [officers, setOfficers] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: crimesData } = await supabase.from("crimes").select("id, crime_type, location")
      const { data: officersData } = await supabase.from("profiles").select("id, full_name").eq("role", "officer")
      setCrimes(crimesData || [])
      setOfficers(officersData || [])
    }
    if (open) fetchData()
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase.from("investigations").insert({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      crime_id: formData.get("crime_id") as string,
      lead_officer: formData.get("lead_officer") as string,
      priority: formData.get("priority") as string,
      status: "pending",
    })

    setIsLoading(false)

    if (!error) {
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-gray-300 bg-white text-gray-900 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#1c1c84]">Create New Investigation</DialogTitle>
          <DialogDescription className="text-gray-600">
            Start a new investigation for a reported crime.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">
              Investigation Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Burglary Investigation - Accra"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detailed description of the investigation"
              required
              className="border-gray-300 bg-white text-gray-900 min-h-[100px] focus:border-[#1c1c84] focus:ring-[#1c1c84]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crime_id" className="text-gray-700">
                Related Crime
              </Label>
              <Select name="crime_id" required>
                <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]">
                  <SelectValue placeholder="Select crime" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {crimes.map((crime) => (
                    <SelectItem key={crime.id} value={crime.id} className="text-gray-900">
                      {crime.crime_type} - {crime.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_officer" className="text-gray-700">
                Lead Officer
              </Label>
              <Select name="lead_officer" required>
                <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]">
                  <SelectValue placeholder="Select officer" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {officers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id} className="text-gray-900">
                      {officer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-gray-700">
              Priority
            </Label>
            <Select name="priority" required>
              <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="Low" className="text-gray-900">
                  Low
                </SelectItem>
                <SelectItem value="Medium" className="text-gray-900">
                  Medium
                </SelectItem>
                <SelectItem value="High" className="text-gray-900">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#1c1c84] hover:bg-[#151563] text-white">
              {isLoading ? "Creating..." : "Create Investigation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
