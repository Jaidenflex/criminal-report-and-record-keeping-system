import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { CriminalRecordsTable } from "@/components/criminal-records-table"
import { AddCriminalRecordDialog } from "@/components/add-criminal-record-dialog"
import { Input } from "@/components/ui/input"

export default async function CriminalRecordsPage() {
  const supabase = await createClient()

  const { data: records } = await supabase
    .from("criminal_records")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criminal Records</h1>
          <p className="text-gray-600">Manage and search criminal records in the database</p>
        </div>
        <AddCriminalRecordDialog>
          <Button className="bg-[#EAB308] hover:bg-[#CA9A06] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </AddCriminalRecordDialog>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">All Criminal Records</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, national ID, or location..."
              className="border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </CardHeader>
        <CardContent>
          <CriminalRecordsTable records={records || []} />
        </CardContent>
      </Card>
    </div>
  )
}
