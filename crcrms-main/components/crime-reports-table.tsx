"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ViewCrimeReportDialog } from "@/components/view-crime-report-dialog"
import { EditCrimeReportDialog } from "@/components/edit-crime-report-dialog"
import { DeleteCrimeReportDialog } from "@/components/delete-crime-report-dialog"
import { AssignOfficerDialog } from "@/components/assign-officer-dialog"

interface Crime {
  id: string
  crime_type: string
  description: string
  location: string
  date_occurred: string
  status: string
  severity: string
  witness_info: string | null
  assigned_officer: string | null
  admin_notes: string | null
  criminal_records?: {
    first_name: string
    last_name: string
  } | null
  reporter?: {
    full_name: string
  } | null
  officer?: {
    full_name: string
  } | null
}

interface CrimeReportsTableProps {
  crimes: Crime[]
  userRole?: string
}

export function CrimeReportsTable({ crimes, userRole }: CrimeReportsTableProps) {
  const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  const handleView = (crime: Crime) => {
    setSelectedCrime(crime)
    setViewDialogOpen(true)
  }

  const handleEdit = (crime: Crime) => {
    setSelectedCrime(crime)
    setEditDialogOpen(true)
  }

  const handleDelete = (crime: Crime) => {
    setSelectedCrime(crime)
    setDeleteDialogOpen(true)
  }

  const handleAssign = (crime: Crime) => {
    setSelectedCrime(crime)
    setAssignDialogOpen(true)
  }

  const isAdmin = userRole === "admin"

  return (
    <>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1c1c84] hover:bg-[#1c1c84]">
              <TableHead className="text-white font-semibold">Crime Type</TableHead>
              <TableHead className="text-white font-semibold">Location</TableHead>
              <TableHead className="text-white font-semibold">Date Occurred</TableHead>
              <TableHead className="text-white font-semibold">Severity</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Reported By</TableHead>
              {isAdmin && <TableHead className="text-white font-semibold">Assigned Officer</TableHead>}
              <TableHead className="text-white font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crimes.length > 0 ? (
              crimes.map((crime) => (
                <TableRow key={crime.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{crime.crime_type}</TableCell>
                  <TableCell className="text-gray-700">{crime.location}</TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(crime.date_occurred).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        crime.severity === "High"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : crime.severity === "Medium"
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }
                    >
                      {crime.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        crime.status === "reported"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : crime.status === "under_investigation"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : crime.status === "solved"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {crime.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{crime.reporter?.full_name || "Unknown"}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-gray-700">
                      {crime.officer?.full_name || <span className="text-gray-400 italic">Not assigned</span>}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(crime)}
                        className="text-[#1c1c84] hover:bg-[#1c1c84]/10 hover:text-[#1c1c84]"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAssign(crime)}
                          className="text-green-600 hover:bg-green-50 hover:text-green-700"
                          title="Assign Officer"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(crime)}
                        className="text-[#EAB308] hover:bg-[#EAB308]/10 hover:text-[#EAB308]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(crime)}
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
                <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center text-gray-500">
                  No crime reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedCrime && (
        <>
          <ViewCrimeReportDialog crime={selectedCrime} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
          <EditCrimeReportDialog crime={selectedCrime} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
          <DeleteCrimeReportDialog crime={selectedCrime} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
          {isAdmin && (
            <AssignOfficerDialog crime={selectedCrime} open={assignDialogOpen} onOpenChange={setAssignDialogOpen} />
          )}
        </>
      )}
    </>
  )
}
