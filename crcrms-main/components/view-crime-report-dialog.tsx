"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Crime {
  id: string
  crime_type: string
  description: string
  location: string
  date_occurred: string
  status: string
  severity: string
  witness_info: string | null
  evidence_urls: string[] | null
  admin_notes: string | null
  criminal_records?: {
    first_name: string
    last_name: string
  } | null
  profiles?: {
    full_name: string
  } | null
  assigned_officer_profile?: {
    full_name: string
    badge_number: string
  } | null
}

interface ViewCrimeReportDialogProps {
  crime: Crime
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCrimeReportDialog({ crime, open, onOpenChange }: ViewCrimeReportDialogProps) {
  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-300 bg-white text-gray-900 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1c1c84]">Crime Report Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Crime Type</p>
              <p className="font-medium text-gray-900">{crime.crime_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Severity</p>
              <Badge
                className={
                  crime.severity === "High"
                    ? "bg-red-500/10 text-red-600 border-red-200"
                    : crime.severity === "Medium"
                      ? "bg-orange-500/10 text-orange-600 border-orange-200"
                      : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                }
              >
                {crime.severity}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="font-medium text-gray-900">{crime.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{crime.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date Occurred</p>
              <p className="font-medium text-gray-900">{new Date(crime.date_occurred).toLocaleString("en-GB")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge
                className={
                  crime.status === "reported"
                    ? "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                    : crime.status === "under_investigation"
                      ? "bg-blue-500/10 text-blue-600 border-blue-200"
                      : crime.status === "solved"
                        ? "bg-green-500/10 text-green-600 border-green-200"
                        : "bg-gray-500/10 text-gray-600 border-gray-200"
                }
              >
                {crime.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reported By</p>
              <p className="font-medium text-gray-900">{crime.profiles?.full_name || "Unknown"}</p>
            </div>
          </div>

          {crime.assigned_officer_profile && (
            <div>
              <p className="text-sm text-gray-600">Assigned Officer</p>
              <p className="font-medium text-gray-900">
                {crime.assigned_officer_profile.full_name} ({crime.assigned_officer_profile.badge_number})
              </p>
            </div>
          )}

          {crime.admin_notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-1">Admin Instructions</p>
              <p className="text-sm text-blue-800">{crime.admin_notes}</p>
            </div>
          )}

          {crime.witness_info && (
            <div>
              <p className="text-sm text-gray-600">Witness Information</p>
              <p className="font-medium text-gray-900">{crime.witness_info}</p>
            </div>
          )}

          {crime.criminal_records && (
            <div>
              <p className="text-sm text-gray-600">Suspect</p>
              <p className="font-medium text-gray-900">
                {crime.criminal_records.first_name} {crime.criminal_records.last_name}
              </p>
            </div>
          )}

          {crime.evidence_urls && crime.evidence_urls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Evidence Files ({crime.evidence_urls.length})</p>
              <div className="grid grid-cols-2 gap-3">
                {crime.evidence_urls.map((url, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {isImageUrl(url) ? (
                      <div className="relative">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Evidence ${index + 1}`}
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 w-7 p-0 bg-white/90 hover:bg-white"
                            onClick={() => window.open(url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-[#1c1c84]" />
                          <span className="text-sm text-gray-700">Document {index + 1}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 border-gray-300 bg-transparent"
                          onClick={() => window.open(url, "_blank")}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
