import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const testUsers = [
  {
    email: "admin@crcrms.gov.gh",
    password: "password123",
    full_name: "System Administrator",
    role: "admin",
    phone: "+233 20 123 4567",
    department: "Administration",
    badge_number: "ADMIN-001",
  },
  {
    email: "officer1@crcrms.gov.gh",
    password: "password123",
    full_name: "Officer Kwame Nkrumah",
    role: "officer",
    phone: "+233 24 234 5678",
    department: "Criminal Investigation",
    badge_number: "OFF-001",
  },
  {
    email: "officer2@crcrms.gov.gh",
    password: "password123",
    full_name: "Officer Yaa Asantewaa",
    role: "officer",
    phone: "+233 26 345 6789",
    department: "Patrol Division",
    badge_number: "OFF-002",
  },
  {
    email: "public1@example.com",
    password: "password123",
    full_name: "John Mensah",
    role: "public",
    phone: "+233 20 456 7890",
    department: null,
    badge_number: null,
  },
  {
    email: "public2@example.com",
    password: "password123",
    full_name: "Grace Osei",
    role: "public",
    phone: "+233 24 567 8901",
    department: null,
    badge_number: null,
  },
]

async function createTestUsers() {
  console.log("[v0] Starting user creation...")

  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      })

      if (authError) {
        console.error(`[v0] Error creating auth user ${user.email}:`, authError.message)
        continue
      }

      console.log(`[v0] Created auth user: ${user.email}`)

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
        department: user.department,
        badge_number: user.badge_number,
      })

      if (profileError) {
        console.error(`[v0] Error creating profile for ${user.email}:`, profileError.message)
        continue
      }

      console.log(`[v0] Created profile for: ${user.email}`)
    } catch (error) {
      console.error(`[v0] Unexpected error for ${user.email}:`, error)
    }
  }

  console.log("[v0] User creation complete!")
}

createTestUsers()
