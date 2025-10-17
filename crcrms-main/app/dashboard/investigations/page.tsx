import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { InvestigationsTable } from "@/components/investigations-table"
import { AddInvestigationDialog } from "@/components/add-investigation-dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function InvestigationsPage() {
  const supabase = await createClient()

  const { data: investigations } = await supabase
    .from("investigations")
    .select("*, crimes(crime_type, location), profiles(full_name)")
    .order("created_at", { ascending: false })

  const pendingInvestigations = investigations?.filter((i) => i.status === "pending") || []
  const activeInvestigations = investigations?.filter((i) => i.status === "active") || []
  const completedInvestigations = investigations?.filter((i) => i.status === "completed") || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investigations</h1>
          <p className="text-gray-600">Manage and track ongoing criminal investigations</p>
        </div>
        <AddInvestigationDialog>
          <Button className="bg-[#1c1c84] hover:bg-[#1c1c84]/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Investigation
          </Button>
        </AddInvestigationDialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            All ({investigations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            Pending ({pendingInvestigations.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            Active ({activeInvestigations.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            Completed ({completedInvestigations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">All Investigations</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by title, crime type, or officer..."
                  className="border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-500 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
                />
              </div>
            </CardHeader>
            <CardContent>
              <InvestigationsTable investigations={investigations || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Pending Investigations</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestigationsTable investigations={pendingInvestigations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Active Investigations</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestigationsTable investigations={activeInvestigations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Completed Investigations</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestigationsTable investigations={completedInvestigations} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
