import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"

export async function GET() {
  try {
    // Fetch claims with user details
    const { data: claims, error: claimsError } = await supabase
      .from("claimTable")
      .select(`
        id,
        created_at,
        itemID,
        founderClerkID,
        claimerClerkID,
        description,
        resolvedAt,
        status,
        itemTable:itemID (
          id,
          created_at,
          clerkID,
       
          itemName,
          category,
          description,
          dateLost,
          location,
          imageUrl,
          status
        ),
        claimer:claimerClerkID (
          clerkID,
          email,
          fullName,
          userRole,
          isActive,
          created_at
        ),
        founder:founderClerkID (
          clerkID,
          email,
          fullName,
          userRole,
          isActive,
          created_at
        )
      `)
      .order("created_at", { ascending: false })
      



    console.log(claims)

    if (claimsError) {
      console.log(claimsError)
      throw claimsError
    }

    return NextResponse.json(claims)
  } catch (error) {
    console.error("Error fetching claims:", error)
    return NextResponse.json(
      { error: "Failed to fetch claims" },
      { status: 500 }
    )
  }
} 