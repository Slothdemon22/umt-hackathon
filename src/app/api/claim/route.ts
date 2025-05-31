import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { itemID, description } = body

    if (!itemID || !description) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Get the founder's clerkID from the itemTable
    const { data: itemData, error: itemError } = await supabase
      .from("itemTable")
      .select("clerkID")
      .eq("id", itemID)
      .single()

    if (itemError || !itemData) {
      return new NextResponse("Item not found", { status: 404 })
    }

    // Insert the claim
    const { data, error } = await supabase
      .from("claimTable")
      .insert({
        itemID,
        founderClerkID: itemData.clerkID,
        claimerClerkID: userId,
        description,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting claim:", error)
      return new NextResponse("Error creating claim", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[CLAIM_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
