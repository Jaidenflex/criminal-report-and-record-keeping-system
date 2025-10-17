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
    role: "admin",
    full_name: "System Administrator",
    badge_number: "ADMIN-001",
    department: "Administration",
    phone: "+233 20 123 4567",
  },
  {
    email: "officer1@crcrms.gov.gh",
    password: "password123",
    role: "officer",
    full_name: "Kwabena Osei",
    badge_number: "OFF-001",
    department: "Criminal Investigation",
    phone: "+233 24 111 2222",
  },
  {
    email: "officer2@crcrms.gov.gh",
    password: "password123",
    role: "officer",
    full_name: "Abena Mensah",
    badge_number: "OFF-002",
    department: "Patrol Division",
    phone: "+233 24 333 4444",
  },
  {
    email: "public1@example.com",
    password: "password123",
    role: "public",
    full_name: "Kofi Annan",
    badge_number: null,
    department: null,
    phone: "+233 20 555 6666",
  },
  {
    email: "public2@example.com",
    password: "password123",
    role: "public",
    full_name: "Ama Agyeman",
    badge_number: null,
    department: null,
    phone: "+233 24 777 8888",
  },
]

async function createUsers() {
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
        badge_number: user.badge_number,
        department: user.department,
        phone: user.phone,
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

  console.log("[v0] User creation completed!")
}

createUsers()
