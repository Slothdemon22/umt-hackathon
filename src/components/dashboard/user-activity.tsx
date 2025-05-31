"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Package2, FileText, Clock, MapPin, Tag, AlertCircle, CheckCircle, XCircle, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserClaim {
  id: number
  itemID: number
  clerkID: string
  description: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  created_at: string
  itemTable: {
    itemName: string
    category: string
    location: string
    status: string
  }
}

interface UserReport {
  id: number
  itemName: string
  category: string
  description: string
  location: string
  status: string
  dateLost: string
  created_at: string
  imageUrl: string
}

export const UserActivity = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("claims")
  const [claims, setClaims] = useState<UserClaim[]>([])
  const [reports, setReports] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!user) return

      try {
        // Fetch user's claims (where they are the claimer)
        const { data: claimsData, error: claimsError } = await supabase
          .from("claimTable")
          .select(`
            *,
            itemTable (
              itemName,
              category,
              location,
              status
            )
          `)
          .eq("claimerClerkID", user.id)
          .order("created_at", { ascending: false })

        if (claimsError) {
          console.error("Error fetching claims:", claimsError)
          throw claimsError
        }

        // Fetch user's reports (items they reported)
        const { data: reportsData, error: reportsError } = await supabase
          .from("itemTable")
          .select("*")
          .eq("clerkID", user.id)
          .order("created_at", { ascending: false })

        if (reportsError) {
          console.error("Error fetching reports:", reportsError)
          throw reportsError
        }

        setClaims(claimsData || [])
        setReports(reportsData || [])
      } catch (error) {
        console.error("Error fetching user activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserActivity()
  }, [user])

  const getClaimStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30"
      case "APPROVED":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
      case "REJECTED":
        return "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30"
    }
  }

  const getItemStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "lost":
        return "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/30"
      case "found":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
      case "claimed":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-cyan-300 border-l-transparent animate-spin animation-delay-300"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
              Loading your activity...
            </p>
            <p className="text-slate-400 mt-2">Gathering your magical journey</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
          Your Magical Journey
        </h2>
        <p className="text-slate-400 text-lg">Track your claims and reported treasures</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="inline-flex h-16 items-center text-base rounded-3xl bg-black/30 backdrop-blur-xl p-2 border border-white/20 shadow-2xl shadow-purple-500/20">
            <TabsTrigger
              value="claims"
              className="relative h-12 rounded-2xl px-8 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-violet-600/40 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white hover:bg-white/10 text-slate-300 group"
            >
              <Package2 className="w-5 h-5 mr-3 group-data-[state=active]:text-purple-300" />
              My Claims
              <Badge className="ml-3 bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm px-2 py-1">
                {claims.length}
              </Badge>
              {activeTab === "claims" && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/30" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="relative h-12 rounded-2xl px-8 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-violet-600/40 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white hover:bg-white/10 text-slate-300 group"
            >
              <FileText className="w-5 h-5 mr-3 group-data-[state=active]:text-blue-300" />
              My Reports
              <Badge className="ml-3 bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm px-2 py-1">
                {reports.length}
              </Badge>
              {activeTab === "reports" && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-blue-500/30" />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-8">
          {activeTab === "claims" && (
            <div className="grid grid-cols-1 gap-6">
              {claims.length === 0 ? (
                <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/20 backdrop-blur-xl shadow-2xl">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <div className="p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-8 border border-purple-500/30">
                      <Package2 className="w-16 h-16 text-purple-400" />
                    </div>
                    <h3 className="text-3xl font-semibold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      No Claims Yet
                    </h3>
                    <p className="text-slate-400 text-lg text-center max-w-md">
                      You haven't made any claims for lost treasures. Start exploring the realm to find your lost items!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                claims.map((claim, index) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/20 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-500 group shadow-xl hover:shadow-purple-500/20">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Left side - Enhanced Image placeholder */}
                          <div className="w-32 h-32 flex-shrink-0 rounded-2xl bg-gradient-to-br from-purple-900/30 to-black/50 flex items-center justify-center border border-white/10 group-hover:border-purple-500/30 transition-all duration-300">
                            <Package2 className="w-10 h-10 text-purple-500/50 group-hover:text-purple-400 transition-colors" />
                            <Star className="w-4 h-4 text-yellow-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          {/* Right side - Enhanced Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-white truncate group-hover:text-purple-200 transition-colors">
                                  {claim.itemTable.itemName}
                                </h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                  <span className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-purple-400" />
                                    <span className="truncate">{claim.itemTable.category}</span>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    <span className="truncate">{claim.itemTable.location}</span>
                                  </span>
                                </div>
                              </div>
                              <Badge
                                className={cn(
                                  "border flex-shrink-0 font-medium px-3 py-1",
                                  getClaimStatusColor(claim.status),
                                )}
                              >
                                {claim.status === "PENDING" && <AlertCircle className="w-4 h-4 mr-2" />}
                                {claim.status === "APPROVED" && <CheckCircle className="w-4 h-4 mr-2" />}
                                {claim.status === "REJECTED" && <XCircle className="w-4 h-4 mr-2" />}
                                {claim.status}
                              </Badge>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                              <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">{claim.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Clock className="w-4 h-4" />
                              Submitted on {format(new Date(claim.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="grid grid-cols-1 gap-6">
              {reports.length === 0 ? (
                <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/20 backdrop-blur-xl shadow-2xl">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <div className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full mb-8 border border-blue-500/30">
                      <FileText className="w-16 h-16 text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-semibold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      No Reports Yet
                    </h3>
                    <p className="text-slate-400 text-lg text-center max-w-md">
                      You haven't reported any lost or found magical items. Help the community by reporting treasures
                      you've found!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/20 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-500 group shadow-xl hover:shadow-blue-500/20">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Left side - Enhanced Image */}
                          <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 group-hover:border-blue-500/30 transition-all duration-300">
                            {report.imageUrl ? (
                              <img
                                src={report.imageUrl || "/placeholder.svg"}
                                alt={report.itemName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-black/50 flex items-center justify-center">
                                <FileText className="w-10 h-10 text-blue-500/50 group-hover:text-blue-400 transition-colors" />
                              </div>
                            )}
                            <Sparkles className="w-4 h-4 text-blue-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          {/* Right side - Enhanced Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-white truncate group-hover:text-blue-200 transition-colors">
                                  {report.itemName}
                                </h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                  <span className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-400" />
                                    <span className="truncate">{report.category}</span>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <span className="truncate">{report.location}</span>
                                  </span>
                                </div>
                              </div>
                              <Badge
                                className={cn(
                                  "border flex-shrink-0 font-medium px-3 py-1",
                                  getItemStatusColor(report.status),
                                )}
                              >
                                {report.status}
                              </Badge>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                              <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                                {report.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Clock className="w-4 h-4" />
                              Reported on {format(new Date(report.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
