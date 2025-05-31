import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"
import resend from "@/lib/resend"

interface ClaimWithItem {
  status: string
  itemID: number
  claimerClerkID: string
  itemTable: {
    itemName: string
  }
  claimer: {
    email: string
    fullName: string
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { claimId, action } = body

    if (!claimId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid request. Required fields: claimId and action (approve/reject)" },
        { status: 400 }
      )
    }

    // First get the claim to check if it's already processed and get necessary IDs
    const { data: existingClaim, error: fetchError } = await supabase
      .from("claimTable")
      .select(`
        status,
        itemID,
        claimerClerkID,
        itemTable!inner(itemName),
        claimer:userTable!claimerClerkID(email, fullName)
      `)
      .eq("id", claimId)
      .single() as { data: ClaimWithItem | null, error: any }

    if (fetchError) {
      console.error("Error fetching claim:", fetchError)
      return NextResponse.json({ error: "Failed to fetch claim" }, { status: 500 })
    }

    if (!existingClaim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 })
    }

    if (existingClaim.status !== "pending") {
      return NextResponse.json(
        { error: "This claim has already been processed" },
        { status: 400 }
      )
    }

    // Update claim status
    const { error: updateError } = await supabase
      .from("claimTable")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        resolvedAt: new Date().toISOString()
      })
      .eq("id", claimId)

    if (updateError) {
      console.error("Error updating claim:", updateError)
      return NextResponse.json({ error: "Failed to update claim" }, { status: 500 })
    }

    // Create notification for the claimer
    const { error: notificationError } = await supabase
      .from("notificationTable")
      .insert({
        clerkID: existingClaim.claimerClerkID,
        Activity: action === "approve" 
          ? `Your claim for "${existingClaim.itemTable.itemName}" has been approved!`
          : `Your claim for "${existingClaim.itemTable.itemName}" has been rejected.`
      })

    if (notificationError) {
      console.error("Error creating notification:", notificationError)
      // Don't return error here as the main action is already completed
    }

    // Send email notification
    try {
      const emailResponse = await resend.emails.send({
        from: 'Lost Realm <onboarding@tradenexusonline.com>',
        to: existingClaim.claimer.email,
        subject: action === "approve" 
          ? `Your claim for ${existingClaim.itemTable.itemName} has been approved!` 
          : `Update on your claim for ${existingClaim.itemTable.itemName}`,
        html: action === "approve"
          ? `
            <h2>Congratulations ${existingClaim.claimer.fullName}!</h2>
            <p>Your claim for "${existingClaim.itemTable.itemName}" has been approved.</p>
            <p>You can now proceed with retrieving your item.</p>
            <p>Thank you for using Lost Realm!</p>
          `
          : `
            <h2>Hello ${existingClaim.claimer.fullName},</h2>
            <p>We regret to inform you that your claim for "${existingClaim.itemTable.itemName}" has been rejected.</p>
            <p>If you believe this is a mistake, please submit a new claim with additional proof or information.</p>
            <p>Thank you for your understanding.</p>
          `
      })
      console.log("Email sent successfully:", emailResponse)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Don't return error here as the main action is already completed
    }

    // If approved, also update the item status to claimed
    if (action === "approve" && existingClaim.itemID) {
      const { error: itemUpdateError } = await supabase
        .from("itemTable")
        .update({ status: "claimed" })
        .eq("id", existingClaim.itemID)

      if (itemUpdateError) {
        console.error("Error updating item:", itemUpdateError)
        // Don't return error here as the claim is already updated
      }
    }

    return NextResponse.json({
      message: `Claim ${action === "approve" ? "approved" : "rejected"} successfully`
    })
  } catch (error) {
    console.error("Error in processClaim route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 