import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"
import { ItemStatus } from "@/types/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as ItemStatus | "all"

    let query = supabase
      .from("itemTable")
      .select(`
        *,
        userTable:clerkID (
          fullName,
          email
        )
      `)
      .order("created_at", { ascending: false })

    // Apply status filter if not "all"
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: items, error } = await query

    if (error) {
      console.error("Error fetching items:", error)
      return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
    }

    // Get counts for each status
    const { data: counts, error: countsError } = await supabase
      .from("itemTable")
      .select("status", { count: "exact" })
      .in("status", [ItemStatus.LOST, ItemStatus.FOUND, ItemStatus.CLAIMED])

    if (countsError) {
      console.error("Error fetching counts:", countsError)
    }

    const statusCounts = {
      all: items.length,
      lost: counts?.filter(item => item.status === ItemStatus.LOST).length || 0,
      found: counts?.filter(item => item.status === ItemStatus.FOUND).length || 0,
      claimed: counts?.filter(item => item.status === ItemStatus.CLAIMED).length || 0
    }

    return NextResponse.json({
      items,
      counts: statusCounts
    })
  } catch (error) {
    console.error("Error in getItems route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 