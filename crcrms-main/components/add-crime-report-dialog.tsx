"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Camera, Upload, X, FileText, ImageIcon } from "lucide-react"

export function AddCrimeReportDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" })
              setUploadedFiles((prev) => [...prev, file])
              stopCamera()
            }
          },
          "image/jpeg",
          0.9,
        )
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async (crimeId: string): Promise<string[]> => {
    const supabase = createClient()
    const uploadedUrls: string[] = []

    for (const file of uploadedFiles) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${crimeId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data, error } = await supabase.storage.from("documents").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Error uploading file:", error)
      } else {
        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("documents").getPublicUrl(fileName)
        uploadedUrls.push(publicUrl)
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: crimeData, error: crimeError } = await supabase
      .from("crimes")
      .insert({
        crime_type: formData.get("crime_type") as string,
        description: formData.get("description") as string,
        location: formData.get("location") as string,
        date_occurred: formData.get("date_occurred") as string,
        severity: formData.get("severity") as string,
        witness_info: formData.get("witness_info") as string,
        status: "reported",
        reported_by: user?.id,
        evidence_urls: [], // Will update after file upload
      })
      .select()
      .single()

    if (crimeError || !crimeData) {
      console.error("Error creating crime report:", crimeError)
      setIsLoading(false)
      return
    }

    if (uploadedFiles.length > 0) {
      const fileUrls = await uploadFiles(crimeData.id)

      // Update crime record with file URLs
      await supabase
        .from("crimes")
        .update({
          evidence_urls: fileUrls,
        })
        .eq("id", crimeData.id)
    }

    setIsLoading(false)
    setOpen(false)
    setUploadedFiles([])
    router.refresh()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          stopCamera()
          setUploadedFiles([])
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-gray-300 bg-white text-gray-900 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1c1c84]">Report a Crime</DialogTitle>
          <DialogDescription className="text-gray-600">
            Provide details about the crime you wish to report.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crime_type" className="text-gray-700">
              Crime Type
            </Label>
            <Input
              id="crime_type"
              name="crime_type"
              placeholder="e.g., Theft, Assault, Burglary"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide detailed description of the incident"
              required
              className="border-gray-300 bg-white text-gray-900 min-h-[100px] focus:border-[#1c1c84] focus:ring-[#1c1c84]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Accra, Greater Accra"
                required
                className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_occurred" className="text-gray-700">
                Date Occurred
              </Label>
              <Input
                id="date_occurred"
                name="date_occurred"
                type="datetime-local"
                required
                className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="severity" className="text-gray-700">
              Severity
            </Label>
            <Select name="severity" required>
              <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="Low" className="text-gray-900">
                  Low
                </SelectItem>
                <SelectItem value="Medium" className="text-gray-900">
                  Medium
                </SelectItem>
                <SelectItem value="High" className="text-gray-900">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="witness_info" className="text-gray-700">
              Witness Information (Optional)
            </Label>
            <Textarea
              id="witness_info"
              name="witness_info"
              placeholder="Any witness information or additional details"
              className="border-gray-300 bg-white text-gray-900 focus:border-[#1c1c84] focus:ring-[#1c1c84]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Evidence (Photos/Documents)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={startCamera}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Camera view */}
            {showCamera && (
              <div className="relative mt-2 rounded-lg overflow-hidden bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  <Button type="button" onClick={capturePhoto} className="bg-[#1c1c84] hover:bg-[#151563] text-white">
                    Capture
                  </Button>
                  <Button type="button" variant="outline" onClick={stopCamera} className="bg-white text-gray-700">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Uploaded files preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-4 w-4 text-[#1c1c84]" />
                      ) : (
                        <FileText className="h-4 w-4 text-[#1c1c84]" />
                      )}
                      <span className="text-sm text-gray-700 truncate max-w-[300px]">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#1c1c84] hover:bg-[#151563] text-white">
              {isLoading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
