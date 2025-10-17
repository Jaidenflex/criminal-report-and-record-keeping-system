"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ViewInvestigationDialog } from "@/components/view-investigation-dialog"
import { EditInvestigationDialog } from "@/components/edit-investigation-dialog"
import { DeleteInvestigationDialog } from "@/components/delete-investigation-dialog"

interface Investigation {
  id: string
  title: string
  description: string
  status: string
  priority: string
  start_date: string
  end_date: string | null
  findings: string | null
  crimes?: {
    crime_type: string
    location: string
  } | null
  profiles?: {
    full_name: string
  } | null
}

interface InvestigationsTableProps {
  investigations: Investigation[]
}

export function InvestigationsTable({ investigations }: InvestigationsTableProps) {
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleView = (investigation: Investigation) => {
    setSelectedInvestigation(investigation)
    setViewDialogOpen(true)
  }

  const handleEdit = (investigation: Investigation) => {
    setSelectedInvestigation(investigation)
    setEditDialogOpen(true)
  }

  const handleDelete = (investigation: Investigation) => {
    setSelectedInvestigation(investigation)
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-gray-50 bg-[#1c1c84]">
              <TableHead className="text-white font-semibold">Title</TableHead>
              <TableHead className="text-white font-semibold">Related Crime</TableHead>
              <TableHead className="text-white font-semibold">Lead Officer</TableHead>
              <TableHead className="text-white font-semibold">Priority</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Start Date</TableHead>
              <TableHead className="text-white font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investigations.length > 0 ? (
              investigations.map((investigation) => (
                <TableRow key={investigation.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{investigation.title}</TableCell>
                  <TableCell className="text-gray-700">{investigation.crimes?.crime_type || "N/A"}</TableCell>
                  <TableCell className="text-gray-700">{investigation.profiles?.full_name || "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        investigation.priority === "High"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : investigation.priority === "Medium"
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }
                    >
                      {investigation.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        investigation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : investigation.status === "active"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : investigation.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {investigation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(investigation.start_date).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(investigation)}
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(investigation)}
                        className="text-[#EAB308] hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(investigation)}
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
                  No investigations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedInvestigation && (
        <>
          <ViewInvestigationDialog
            investigation={selectedInvestigation}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
          <EditInvestigationDialog
            investigation={selectedInvestigation}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <DeleteInvestigationDialog
            investigation={selectedInvestigation}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </>
  )
}
