import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { AuditLogsTable } from "@/components/audit-logs-table"
import { Input } from "@/components/ui/input"

export default async function AuditLogsPage() {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Track all system activities and changes</p>
        </div>
      </div>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Activity</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by action, table, or user..."
              className="border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-500 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <AuditLogsTable logs={logs || []} />
        </CardContent>
      </Card>
    </div>
  )
}
