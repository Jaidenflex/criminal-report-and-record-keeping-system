import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminAccount() {
  console.log("[v0] Creating admin account...")

  const adminEmail = "admin@crcrms.gov.gh"
  const adminPassword = "Admin@2025!"

  try {
    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "System Administrator",
      },
    })

    if (authError) {
      console.error("[v0] Error creating admin user:", authError.message)
      return
    }

    console.log("[v0] Admin user created:", authData.user.id)

    // Create admin profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: adminEmail,
      full_name: "System Administrator",
      role: "admin",
      phone: "+233 20 000 0000",
      department: "Administration",
    })

    if (profileError) {
      console.error("[v0] Error creating admin profile:", profileError.message)
      return
    }

    console.log("[v0] ✅ Admin account created successfully!")
    console.log("[v0] Email:", adminEmail)
    console.log("[v0] Password:", adminPassword)
    console.log("[v0] Please save these credentials securely!")
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
  }
}

createAdminAccount()
