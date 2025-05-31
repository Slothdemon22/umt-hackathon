"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/db"
import { toast } from "sonner"

export const UserRegistration = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, user } = useUser()

  useEffect(() => {
    const registerUser = async () => {
      if (!isLoaded || !user) return

      try {
        const email = user.emailAddresses[0]?.emailAddress
        
        // First check by email
        const { data: existingUserByEmail } = await supabase
          .from("userTable")
          .select("*")
          .eq("email", email)
          .single()

        if (existingUserByEmail) {
          console.log("User already exists with this email")
          return // Skip registration if email exists
        }

        // Then check by clerkID
        const { data: existingUserByClerkId } = await supabase
          .from("userTable")
          .select("*")
          .eq("clerkID", user.id)
          .single()

        if (existingUserByClerkId) {
          console.log("User already exists with this clerkID")
          // Update existing user info
          const { error: updateError } = await supabase
            .from("userTable")
            .update({
              imageUrl: user.imageUrl,
              fullName: user.fullName,
            })
            .eq("clerkID", user.id)

          if (updateError) {
            console.error("Error updating user:", updateError)
          }
          return
        }

        // Only register if user doesn't exist at all
        if (!existingUserByEmail && !existingUserByClerkId) {
          console.log("Registering new user")
          const userData = {
            clerkID: user.id,
            imageUrl: user.imageUrl,
            email: email,
            fullName: user.fullName,
            userRole: "student",
            isActive: true,
            created_at: new Date().toISOString()
          }

          const { error: insertError } = await supabase
            .from("userTable")
            .insert([userData])

          if (insertError) {
            console.error("Error registering user:", insertError)
            toast.error("Failed to register user")
            return
          }

          console.log("User registered successfully")
          toast.success("Welcome to Lost & Found!")
        }
      } catch (err) {
        console.error("Error in user registration:", err)
        toast.error("Something went wrong during registration")
      }
    }

    // Call registerUser immediately when user changes
    if (user) {
      registerUser()
    }
  }, [isLoaded, user])

  return <>{children}</>
} 