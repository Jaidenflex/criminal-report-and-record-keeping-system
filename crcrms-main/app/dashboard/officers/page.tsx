import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddOfficerDialog } from "@/components/add-officer-dialog"
import { OfficersTable } from "@/components/officers-table"

export default async function OfficersPage() {
  const supabase = await createClient()

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all officers
  const { data: officers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "officer")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Officers Management</h1>
          <p className="text-gray-600">Add and manage police officers in the system</p>
        </div>
        <AddOfficerDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Officers</CardTitle>
          <CardDescription>List of all registered police officers</CardDescription>
        </CardHeader>
        <CardContent>
          <OfficersTable officers={officers || []} />
        </CardContent>
      </Card>
    </div>
  )
}
