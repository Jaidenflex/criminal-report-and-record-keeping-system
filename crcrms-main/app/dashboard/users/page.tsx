import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { UsersTable } from "@/components/users-table"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const adminUsers = users?.filter((u) => u.role === "admin") || []
  const officerUsers = users?.filter((u) => u.role === "officer") || []
  const publicUsers = users?.filter((u) => u.role === "public") || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            All Users ({users?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            Admins ({adminUsers.length})
          </TabsTrigger>
          <TabsTrigger value="officer" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            Officers ({officerUsers.length})
          </TabsTrigger>
          <TabsTrigger value="public" className="data-[state=active]:bg-[#1c1c84] data-[state=active]:text-white">
            Public ({publicUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">All Users</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or role..."
                  className="border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-500 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
                />
              </div>
            </CardHeader>
            <CardContent>
              <UsersTable users={users || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable users={adminUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="officer">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Officer Users</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable users={officerUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public">
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Public Users</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable users={publicUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
