"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ViewUserDialog } from "@/components/view-user-dialog"
import { EditUserDialog } from "@/components/edit-user-dialog"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  badge_number: string | null
  department: string | null
  phone: string | null
  created_at: string
}

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleView = (user: User) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-gray-50 bg-[#1c1c84]">
              <TableHead className="text-white font-semibold">Name</TableHead>
              <TableHead className="text-white font-semibold">Email</TableHead>
              <TableHead className="text-white font-semibold">Role</TableHead>
              <TableHead className="text-white font-semibold">Badge Number</TableHead>
              <TableHead className="text-white font-semibold">Department</TableHead>
              <TableHead className="text-white font-semibold">Joined</TableHead>
              <TableHead className="text-white font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{user.full_name}</TableCell>
                  <TableCell className="text-gray-700">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : user.role === "officer"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{user.badge_number || "N/A"}</TableCell>
                  <TableCell className="text-gray-700">{user.department || "N/A"}</TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(user.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(user)}
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        className="text-[#EAB308] hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <ViewUserDialog user={selectedUser} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
          <EditUserDialog user={selectedUser} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
        </>
      )}
    </>
  )
}
