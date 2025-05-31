import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"
import type { User } from "@/types/types"

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from("userTable")
      .select(`
        clerkID,
        created_at,
        email,
        fullName,
        userRole,
        isActive
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Ensure the data matches our User type
    const typedUsers = users as User[]
    return NextResponse.json(typedUsers)
  } catch (error) {
    console.error("Error in getUsers route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 