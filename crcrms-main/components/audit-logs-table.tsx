"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AuditLog {
  id: string
  action: string
  table_name: string
  record_id: string | null
  ip_address: string | null
  created_at: string
  profiles?: {
    full_name: string
  } | null
}

interface AuditLogsTableProps {
  logs: AuditLog[]
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const getActionColor = (action: string) => {
    if (action.includes("INSERT") || action.includes("CREATE")) {
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    }
    if (action.includes("UPDATE") || action.includes("EDIT")) {
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
    }
    if (action.includes("DELETE") || action.includes("REMOVE")) {
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    }
    return "bg-slate-500/10 text-slate-400 hover:bg-slate-500/20"
  }

  return (
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 hover:bg-gray-50 bg-[#1c1c84]">
            <TableHead className="text-white font-semibold">Action</TableHead>
            <TableHead className="text-white font-semibold">Table</TableHead>
            <TableHead className="text-white font-semibold">User</TableHead>
            <TableHead className="text-white font-semibold">IP Address</TableHead>
            <TableHead className="text-white font-semibold">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log.id} className="border-gray-200 hover:bg-gray-50">
                <TableCell>
                  <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                </TableCell>
                <TableCell className="font-medium text-gray-900">{log.table_name}</TableCell>
                <TableCell className="text-gray-700">{log.profiles?.full_name || "System"}</TableCell>
                <TableCell className="text-gray-700">{log.ip_address || "N/A"}</TableCell>
                <TableCell className="text-gray-700">{new Date(log.created_at).toLocaleString("en-GB")}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                No audit logs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
