"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AddOfficerDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const badgeNumber = formData.get("badgeNumber") as string
    const department = formData.get("department") as string

    try {
      const supabase = createClient()

      // Create the officer account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "officer",
            badge_number: badgeNumber,
            department: department,
          },
        },
      })

      if (signUpError) throw signUpError

      // Update the profile with officer details
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: "officer",
            badge_number: badgeNumber,
            department: department,
          })
          .eq("id", data.user.id)

        if (profileError) throw profileError
      }

      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create officer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#EAB308] text-gray-900 hover:bg-[#EAB308]/90">
          <UserPlus className="mr-2 h-5 w-5" />
          Add Officer
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gray-200 bg-white text-gray-900 sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[#1c1c84]">Add New Officer</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new police officer account in the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-gray-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                className="border-gray-300 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="officer@police.gov.gh"
                required
                className="border-gray-300 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="border-gray-300 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="badgeNumber" className="text-gray-700">
                Badge Number
              </Label>
              <Input
                id="badgeNumber"
                name="badgeNumber"
                placeholder="OFF-12345"
                required
                className="border-gray-300 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department" className="text-gray-700">
                Department
              </Label>
              <Input
                id="department"
                name="department"
                placeholder="Criminal Investigation"
                required
                className="border-gray-300 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#1c1c84] text-white hover:bg-[#1c1c84]/90">
              {isLoading ? "Creating..." : "Create Officer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
