"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Compass, LogOut, Search, Bell, Menu, X, Sparkles, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useUser, SignInButton, SignOutButton, useClerk } from "@clerk/nextjs"
import { supabase } from "@/lib/db"

interface FloatingNavbarProps {
  notificationCount?: number
}

export function Navbar({ notificationCount = 0 }: FloatingNavbarProps) {
  const { isSignedIn, user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  useEffect(() => {
    if (!isLoaded || !user) return

    const handleUserSync = async () => {
      try {
        // Check if user exists in Supabase by clerkID or email
        const { data: existingUser, error: fetchError } = await supabase
          .from("userTable")
          .select("*")
          .or(`clerkID.eq.${user.id},email.eq.${user.emailAddresses[0]?.emailAddress}`)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error checking user:", fetchError)
          return
        }

        if (!existingUser) {
          // Only register if user doesn't exist at all
          const { error: insertError } = await supabase.from("userTable").insert({
            clerkID: user.id,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0]?.emailAddress,
            fullName: user.fullName,
          })

          if (insertError) {
            console.error("Error registering user:", insertError)
            return
          }
          console.log("User registered successfully")
        } else {
          // Update existing user's information if clerkID matches
          if (existingUser.clerkID === user.id) {
            const { error: updateError } = await supabase
              .from("userTable")
              .update({
                imageUrl: user.imageUrl,
                fullName: user.fullName,
              })
              .eq("clerkID", user.id)

            if (updateError) {
              console.error("Error updating user:", updateError)
              return
            }
            console.log("User information updated successfully")
          }
        }
      } catch (err) {
        console.error("Error in user sync:", err)
      }
    }

    handleUserSync()
  }, [isLoaded, user])

  return (
    <header
      className={cn(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-out w-[95%] max-w-7xl",
        scrolled
          ? "bg-black/20 backdrop-blur-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] shadow-purple-500/20"
          : "bg-black/10 backdrop-blur-lg border border-purple-400/10 shadow-[0_0_10px_rgba(168,85,247,0.1)]",
        "rounded-full px-4 relative before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-purple-500/10 before:via-transparent before:to-purple-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
      )}
    >
      <div className="container mx-auto px-2 py-3 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-10 group pl-2">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
              <Compass className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="h-2 w-2 text-white m-0.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-violet-300 group-hover:to-indigo-300 transition-all duration-300">
              Lost Realm
            </span>
            <span className="text-xs text-white/60 font-medium tracking-wider">EXPLORE • DISCOVER • ADVENTURE</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/">Home</NavLink>
         
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/profile">Profile</NavLink>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {isLoaded && (
            <>
              {isSignedIn ? (
                <>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 relative"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full p-0 hover:scale-105 transition-transform duration-300"
                      >
                        <Avatar className="h-10 w-10 border-2 border-white/20 hover:border-purple-400/50 transition-colors duration-300">
                          <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white font-semibold">
                            {user?.fullName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 bg-black/80 backdrop-blur-xl border border-white/10 text-white shadow-2xl shadow-purple-500/20"
                      align="end"
                    >
                      <DropdownMenuLabel className="text-white/90">My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {user?.publicMetadata?.role === 'admin' && (
                        <>
                          <Link href="/adminPanel">
                            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer text-purple-400 hover:text-purple-300 transition-colors">
                              <Shield className="h-4 w-4 mr-2" />
                              Admin Panel
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator className="bg-white/10" />
                        </>
                      )}
                      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer text-white/80 hover:text-white transition-colors">
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer text-white/80 hover:text-white transition-colors">
                        My Adventures
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer text-white/80 hover:text-white transition-colors">
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem 
                        className="hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer text-red-400 hover:text-red-300 transition-colors"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 hover:from-purple-600 hover:to-violet-600"
                    onClick={() => {
                      console.log("Sign in button clicked")
                      // The actual sign in will be handled by Clerk
                    }}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Expandable Search Bar */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[95%] max-w-7xl bg-black/30 backdrop-blur-xl transition-all duration-500 overflow-hidden border border-purple-500/20 rounded-2xl shadow-[0_0_10px_rgba(168,85,247,0.1)]",
          searchOpen ? "max-h-24 py-4 opacity-100" : "max-h-0 py-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              type="text"
              placeholder="Search for realms, adventures, mysteries..."
              className="pl-12 pr-4 h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-400 rounded-xl transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[95%] max-w-7xl bg-black/30 backdrop-blur-xl transition-all duration-500 overflow-hidden border border-purple-500/20 rounded-2xl shadow-[0_0_10px_rgba(168,85,247,0.1)] md:hidden",
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-4 py-6">
          <nav className="flex flex-col gap-1">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
           
            <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/profile" onClick={() => setMobileMenuOpen(false)}>
              Profile
            </MobileNavLink>
          </nav>

          {isLoaded && (
            <>
              {isSignedIn ? (
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white font-semibold">
                        {user?.fullName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{user?.fullName}</p>
                      <p className="text-sm text-white/60">Explorer</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-300"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <SignInButton mode="modal">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 hover:from-purple-600 hover:to-violet-600"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </div>
              )}
            </>
          )}

          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              type="text"
              placeholder="Search adventures..."
              className="pl-12 pr-4 h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-400 rounded-xl"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

// Desktop Navigation Link
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-white/70 hover:text-white font-medium transition-all duration-300 rounded-full hover:bg-white/10 hover:shadow-[0_0_10px_rgba(168,85,247,0.1)] backdrop-blur-sm group"
    >
      {children}
      <div className="absolute inset-x-2 bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_rgba(168,85,247,0.3)]" />
    </Link>
  )
}

// Mobile Navigation Link
function MobileNavLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-3 text-white/80 hover:text-white font-medium transition-all duration-300 rounded-full hover:bg-white/10 hover:shadow-[0_0_10px_rgba(168,85,247,0.1)] backdrop-blur-sm flex items-center group"
      onClick={onClick}
    >
      <span className="relative">
        {children}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_rgba(168,85,247,0.3)]" />
      </span>
    </Link>
  )
}
