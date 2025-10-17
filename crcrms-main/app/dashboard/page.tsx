import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertCircle, Search, Users, TrendingUp, TrendingDown, Plus, Bell } from "lucide-react"
import { redirect } from "next/navigation"
import { AddCrimeReportDialog } from "@/components/add-crime-report-dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user and profile
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

  const isAdmin = profile.role === "admin"
  const isOfficer = profile.role === "officer"
  const isPublic = profile.role === "public"

  // Fetch statistics based on role
  let criminalRecordsCount = 0
  let crimesCount = 0
  let investigationsCount = 0
  let usersCount = 0
  let assignedCasesCount = 0

  if (isAdmin || isOfficer) {
    const { count: crCount } = await supabase.from("criminal_records").select("*", { count: "exact", head: true })
    criminalRecordsCount = crCount || 0

    const { count: cCount } = await supabase.from("crimes").select("*", { count: "exact", head: true })
    crimesCount = cCount || 0

    const { count: iCount } = await supabase.from("investigations").select("*", { count: "exact", head: true })
    investigationsCount = iCount || 0
  }

  if (isOfficer) {
    const { count: assignedCount } = await supabase
      .from("crimes")
      .select("*", { count: "exact", head: true })
      .eq("assigned_officer", user.id)
    assignedCasesCount = assignedCount || 0
  }

  if (isAdmin) {
    const { count: uCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
    usersCount = uCount || 0
  }

  if (isPublic) {
    // Public users only see their own crime reports
    const { count: myCrimesCount } = await supabase
      .from("crimes")
      .select("*", { count: "exact", head: true })
      .eq("reported_by", user.id)
    crimesCount = myCrimesCount || 0
  }

  let assignedCases: any[] = []
  if (isOfficer) {
    const { data } = await supabase
      .from("crimes")
      .select("*")
      .eq("assigned_officer", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
    assignedCases = data || []
  }

  const recentCrimesQuery = supabase
    .from("crimes")
    .select("*, criminal_records(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  if (isPublic) {
    recentCrimesQuery.eq("reported_by", user.id)
  }

  const { data: recentCrimes } = await recentCrimesQuery

  // Fetch crime statistics by status
  const crimesByStatusQuery = supabase.from("crimes").select("status")

  if (isPublic) {
    crimesByStatusQuery.eq("reported_by", user.id)
  }

  const { data: crimesData } = await crimesByStatusQuery
  const crimesByStatus = crimesData?.reduce(
    (acc, crime) => {
      acc[crime.status] = (acc[crime.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          {isAdmin && "Admin Overview - Full System Access"}
          {isOfficer && "Officer Dashboard - Manage Cases and Investigations"}
          {isPublic && "Your Crime Reports Dashboard"}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(isAdmin || isOfficer) && (
          <Card className="border-0 bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Criminal Records</CardTitle>
              <FileText className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{criminalRecordsCount}</div>
              <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span> from last month
              </p>
            </CardContent>
          </Card>
        )}

        {isOfficer && (
          <Card className="border-0 bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">My Assigned Cases</CardTitle>
              <Image src="/images/crcrms-logo.jpeg" alt="Cases" width={20} height={20} className="rounded" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{assignedCasesCount}</div>
              <p className="text-xs text-white/80 mt-1">Cases assigned to you</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              {isPublic ? "My Reports" : "Crime Reports"}
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{crimesCount}</div>
            <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" />
              <span>-5%</span> from last month
            </p>
          </CardContent>
        </Card>

        {isPublic && (
          <>
            <Card className="border-0 bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Pending Reports</CardTitle>
                <Bell className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{crimesByStatus?.["reported"] || 0}</div>
                <p className="text-xs text-white/80 mt-1">Awaiting investigation</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Resolved Cases</CardTitle>
                <Image src="/images/crcrms-logo.jpeg" alt="Resolved" width={20} height={20} className="rounded" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{crimesByStatus?.["solved"] || 0}</div>
                <p className="text-xs text-white/80 mt-1">Successfully resolved</p>
              </CardContent>
            </Card>
          </>
        )}

        {(isAdmin || isOfficer) && (
          <Card className="border-0 bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Active Investigations</CardTitle>
              <Search className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{investigationsCount}</div>
              <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+8%</span> from last month
              </p>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Users</CardTitle>
              <Users className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{usersCount}</div>
              <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+3%</span> from last month
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {isPublic && (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <AddCrimeReportDialog>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-auto py-6 flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span className="font-semibold">Submit New Report</span>
                  <span className="text-xs opacity-80">Report a crime incident</span>
                </Button>
              </AddCrimeReportDialog>

              <Link href="/dashboard/crime-reports" className="w-full">
                <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2 border-gray-300 bg-transparent">
                  <FileText className="h-6 w-6" />
                  <span className="font-semibold">View All Reports</span>
                  <span className="text-xs opacity-80">Check report status</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full h-auto py-6 flex-col gap-2 border-gray-300 bg-transparent"
                disabled
              >
                <Bell className="h-6 w-6" />
                <span className="font-semibold">Notifications</span>
                <span className="text-xs opacity-80">Coming soon</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">{isPublic ? "My Recent Reports" : "Recent Crime Reports"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCrimes && recentCrimes.length > 0 ? (
                recentCrimes.map((crime) => (
                  <div key={crime.id} className="flex items-start justify-between border-b border-gray-200 pb-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{crime.crime_type}</p>
                      <p className="text-xs text-gray-600">{crime.location}</p>
                      <p className="text-xs text-gray-500">
                        {crime.date_occurred
                          ? new Date(crime.date_occurred).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Date not available"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        crime.status === "reported"
                          ? "bg-yellow-100 text-yellow-800"
                          : crime.status === "under_investigation"
                            ? "bg-blue-100 text-blue-800"
                            : crime.status === "solved"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {crime.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-4">No crime reports yet</p>
                  {isPublic && (
                    <AddCrimeReportDialog>
                      <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Submit Your First Report
                      </Button>
                    </AddCrimeReportDialog>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Crime Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crimesByStatus && Object.keys(crimesByStatus).length > 0 ? (
                Object.entries(crimesByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          status === "reported"
                            ? "bg-yellow-500"
                            : status === "under_investigation"
                              ? "bg-blue-500"
                              : status === "solved"
                                ? "bg-green-500"
                                : "bg-gray-500"
                        }`}
                      />
                      <span className="text-sm capitalize text-gray-700">{status.replace("_", " ")}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No crime data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isOfficer && assignedCases.length > 0 && (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">My Assigned Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedCases.map((crime) => (
                <div key={crime.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{crime.crime_type}</p>
                      <p className="text-xs text-gray-600">{crime.location}</p>
                      <p className="text-xs text-gray-500">
                        {crime.date_occurred
                          ? new Date(crime.date_occurred).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Date not available"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        crime.status === "reported"
                          ? "bg-yellow-100 text-yellow-800"
                          : crime.status === "under_investigation"
                            ? "bg-blue-100 text-blue-800"
                            : crime.status === "solved"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {crime.status.replace("_", " ")}
                    </span>
                  </div>
                  {crime.admin_notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-xs font-medium text-blue-900 mb-1">Instructions from Admin:</p>
                      <p className="text-sm text-blue-800">{crime.admin_notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/crime-reports/${crime.id}`}>
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" className="text-xs bg-primary text-primary-foreground">
                      Update Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
