import { Button } from "@/components/ui/button"
import { FileText, Search, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image src="/images/crcrms-logo.jpeg" alt="CRCRMS Logo" width={40} height={40} className="rounded-md" />
            <span className="text-xl font-bold text-[#1c1c84]">CRCRMS</span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" className="text-gray-700 hover:text-[#1c1c84]">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-[#EAB308] hover:bg-[#ca9a07] text-white">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-[#1c1c84]">
              Criminal Records & Crime Reporting Management System
            </h1>
            <p className="text-xl text-gray-700">
              A comprehensive platform for managing criminal records, reporting crimes, and tracking investigations
              across Ghana
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button asChild size="lg" className="bg-[#EAB308] hover:bg-[#ca9a07] text-white">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#1c1c84] text-[#1c1c84] hover:bg-[#1c1c84] hover:text-white bg-transparent"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <FileText className="mb-4 h-10 w-10 text-[#1c1c84]" />
              <h3 className="mb-2 text-xl font-semibold text-[#1c1c84]">Criminal Records</h3>
              <p className="text-gray-600">Maintain comprehensive criminal records with advanced search capabilities</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <Image
                src="/images/crcrms-logo.jpeg"
                alt="Crime Reporting"
                width={40}
                height={40}
                className="mb-4 rounded-md"
              />
              <h3 className="mb-2 text-xl font-semibold text-[#1c1c84]">Crime Reporting</h3>
              <p className="text-gray-600">Enable citizens to report crimes easily and track their status</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <Search className="mb-4 h-10 w-10 text-[#1c1c84]" />
              <h3 className="mb-2 text-xl font-semibold text-[#1c1c84]">Investigation Tracking</h3>
              <p className="text-gray-600">Monitor ongoing investigations and manage case assignments</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <Users className="mb-4 h-10 w-10 text-[#1c1c84]" />
              <h3 className="mb-2 text-xl font-semibold text-[#1c1c84]">User Management</h3>
              <p className="text-gray-600">Role-based access control for officers, admins, and public users</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white/80 py-6 backdrop-blur">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2025 CRCRMS. All rights reserved. Ghana Police Service</p>
        </div>
      </footer>
    </div>
  )
}
