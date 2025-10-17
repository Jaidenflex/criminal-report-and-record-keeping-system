"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ViewCriminalRecordDialog } from "@/components/view-criminal-record-dialog"
import { EditCriminalRecordDialog } from "@/components/edit-criminal-record-dialog"
import { DeleteCriminalRecordDialog } from "@/components/delete-criminal-record-dialog"

interface CriminalRecord {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  national_id: string | null
  gender: string | null
  address: string | null
  status: string
  created_at: string
}

interface CriminalRecordsTableProps {
  records: CriminalRecord[]
}

export function CriminalRecordsTable({ records }: CriminalRecordsTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<CriminalRecord | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleView = (record: CriminalRecord) => {
    setSelectedRecord(record)
    setViewDialogOpen(true)
  }

  const handleEdit = (record: CriminalRecord) => {
    setSelectedRecord(record)
    setEditDialogOpen(true)
  }

  const handleDelete = (record: CriminalRecord) => {
    setSelectedRecord(record)
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1c1c84] hover:bg-[#1c1c84]">
              <TableHead className="text-white font-semibold">Name</TableHead>
              <TableHead className="text-white font-semibold">National ID</TableHead>
              <TableHead className="text-white font-semibold">Date of Birth</TableHead>
              <TableHead className="text-white font-semibold">Gender</TableHead>
              <TableHead className="text-white font-semibold">Location</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {record.first_name} {record.last_name}
                  </TableCell>
                  <TableCell className="text-gray-700">{record.national_id || "N/A"}</TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(record.date_of_birth).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-gray-700">{record.gender || "N/A"}</TableCell>
                  <TableCell className="text-gray-700">{record.address || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={record.status === "active" ? "default" : "secondary"}
                      className={
                        record.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : record.status === "archived"
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(record)}
                        className="text-[#1c1c84] hover:bg-[#1c1c84]/10 hover:text-[#1c1c84]"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(record)}
                        className="text-[#EAB308] hover:bg-[#EAB308]/10 hover:text-[#EAB308]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  No criminal records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRecord && (
        <>
          <ViewCriminalRecordDialog record={selectedRecord} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
          <EditCriminalRecordDialog record={selectedRecord} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
          <DeleteCriminalRecordDialog
            record={selectedRecord}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </>
  )
}
