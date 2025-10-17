import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { CrimeReportsTable } from "@/components/crime-reports-table"
import { AddCrimeReportDialog } from "@/components/add-crime-report-dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"

export default async function CrimeReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  const isPublic = profile.role === "public"

  const crimesQuery = supabase
    .from("crimes")
    .select("*, criminal_records(first_name, last_name)")
    .order("created_at", { ascending: false })

  if (isPublic) {
    crimesQuery.eq("reported_by", user.id)
  }

  const { data: crimes } = await crimesQuery

  // Fetch all profiles to join manually
  const { data: profiles } = await supabase.from("profiles").select("id, full_name")

  // Create a map of profiles for easy lookup
  const profilesMap = new Map(profiles?.map((p) => [p.id, p]) || [])

  // Enrich crimes with reporter and officer data
  const enrichedCrimes = crimes?.map((crime) => ({
    ...crime,
    reporter: crime.reported_by ? profilesMap.get(crime.reported_by) : null,
    officer: crime.assigned_officer ? profilesMap.get(crime.assigned_officer) : null,
  }))

  const reportedCrimes = enrichedCrimes?.filter((c) => c.status === "reported") || []
  const investigatingCrimes = enrichedCrimes?.filter((c) => c.status === "under_investigation") || []
  const solvedCrimes = enrichedCrimes?.filter((c) => c.status === "solved") || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isPublic ? "My Crime Reports" : "Crime Reports"}</h1>
          <p className="text-gray-600">
            {isPublic ? "View and track your submitted crime reports" : "Manage and track crime reports from citizens"}
          </p>
        </div>
        <AddCrimeReportDialog>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="mr-2 h-4 w-4" />
            Report Crime
          </Button>
        </AddCrimeReportDialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Reports ({enrichedCrimes?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="reported"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Reported ({reportedCrimes.length})
          </TabsTrigger>
          <TabsTrigger
            value="investigating"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Investigating ({investigatingCrimes.length})
          </TabsTrigger>
          <TabsTrigger
            value="solved"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Solved ({solvedCrimes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">All Crime Reports</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by crime type, location, or status..."
                  className="border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <CrimeReportsTable crimes={enrichedCrimes || []} userRole={profile.role} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reported">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Reported Crimes</CardTitle>
            </CardHeader>
            <CardContent>
              <CrimeReportsTable crimes={reportedCrimes} userRole={profile.role} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investigating">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Under Investigation</CardTitle>
            </CardHeader>
            <CardContent>
              <CrimeReportsTable crimes={investigatingCrimes} userRole={profile.role} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solved">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Solved Crimes</CardTitle>
            </CardHeader>
            <CardContent>
              <CrimeReportsTable crimes={solvedCrimes} userRole={profile.role} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
