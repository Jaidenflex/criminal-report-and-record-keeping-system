"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface Officer {
  id: string
  full_name: string
  email: string
  badge_number: string | null
  department: string | null
  created_at: string
}

interface OfficersTableProps {
  officers: Officer[]
}

export function OfficersTable({ officers }: OfficersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.badge_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search officers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-300 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
        />
      </div>

      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1c1c84] hover:bg-[#1c1c84]">
              <TableHead className="text-white font-semibold">Name</TableHead>
              <TableHead className="text-white font-semibold">Email</TableHead>
              <TableHead className="text-white font-semibold">Badge Number</TableHead>
              <TableHead className="text-white font-semibold">Department</TableHead>
              <TableHead className="text-white font-semibold">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOfficers.length > 0 ? (
              filteredOfficers.map((officer) => (
                <TableRow key={officer.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{officer.full_name}</TableCell>
                  <TableCell className="text-gray-700">{officer.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-[#1c1c84] text-white hover:bg-[#1c1c84]/90">{officer.badge_number}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{officer.department}</TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(officer.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No officers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
