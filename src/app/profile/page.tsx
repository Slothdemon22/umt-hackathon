"use client"

import { useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bell,
  Clock,
  Mail,
  Star,
  Sparkles,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Trophy,
  Target,
  Zap,
  Crown,
  Settings,
  Edit3,
  FileText,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/db"
import { ItemStatus } from "@/types/types"
import { Notifications } from "@/components/profile/notifications"

const ProfilePage = () => {
  const { user } = useUser()
  const [stats, setStats] = useState({
    reportedItems: 0,
    approvedClaims: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // Get number of reported items
        const { data: reportedItems, error: itemsError } = await supabase
          .from("itemTable")
          .select("id")
          .eq("clerkID", user.id)

        if (itemsError) {
          console.error("Error fetching items:", itemsError)
          return
        }

        // Get number of approved claims
        const { data: approvedClaims, error: claimsError } = await supabase
          .from("claimTable")
          .select("id")
          .eq("claimerClerkID", user.id)
          .eq("status", "approved")

        if (claimsError) {
          console.error("Error fetching claims:", claimsError)
          return
        }

        setStats({
          reportedItems: reportedItems?.length || 0,
          approvedClaims: approvedClaims?.length || 0,
        })

        console.log("Stats fetched:", { reportedItems, approvedClaims }) // Debug log
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [user])

  const achievements = [
    { name: "First Discovery", icon: Star, color: "text-yellow-400" },
    { name: "Helpful Explorer", icon: Shield, color: "text-blue-400" },
    { name: "Treasure Hunter", icon: Trophy, color: "text-purple-400" },
    { name: "Realm Guardian", icon: Crown, color: "text-amber-400" },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/3 to-transparent rounded-full" />
      </div>

      {/* Space for navbar */}
      <div className="h-20" />

      <div className="container mx-auto px-6 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-500/10">
            {/* Cover Image Area */}
            <div className="relative h-56 bg-gradient-to-r from-purple-600/30 via-violet-600/30 to-indigo-600/30">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Decorative Elements */}
              <div className="absolute top-12 left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-12 right-12 w-24 h-24 bg-violet-500/10 rounded-full blur-xl"></div>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 -mt-20 relative">
                {/* Avatar with Enhanced Glow Effect */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                  <Avatar className="h-40 w-40 border-4 border-black/30 shadow-2xl relative bg-gradient-to-br from-purple-600/20 to-violet-600/20">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-4xl text-white font-bold">
                      {user.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-black/50 shadow-lg">
                    <div className="w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent mb-2">
                      {user.fullName}
                    </h1>
                    <p className="text-lg text-slate-300 mb-4">Master Explorer of the Lost Realm</p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <Mail className="h-4 w-4 text-purple-400" />
                        {user.primaryEmailAddress?.emailAddress}
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <MapPin className="h-4 w-4 text-violet-400" />
                        Lost Realm Campus
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        Joined {user.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "Unknown"}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Badges */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <Badge
                      variant="outline"
                      className="border-purple-500/30 bg-purple-500/10 text-purple-300 px-3 py-1.5 text-sm"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Master Explorer
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-violet-500/30 bg-violet-500/10 text-violet-300 px-3 py-1.5 text-sm"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Trusted Guardian
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
              <motion.div
                className="p-6 text-center group hover:bg-white/5 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110 bg-purple-500/10 border-purple-500/20">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {stats.reportedItems}
                </div>
                <div className="text-sm text-slate-400">Reported Items</div>
              </motion.div>

              <motion.div
                className="p-6 text-center group hover:bg-white/5 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110 bg-emerald-500/10 border-emerald-500/20">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {stats.approvedClaims}
                </div>
                <div className="text-sm text-slate-400">Claims Approved</div>
              </motion.div>
            </div>
          </Card>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="bg-black/20 border-white/10 p-1.5 backdrop-blur-sm">
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-purple-500/30 px-6 py-2.5"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="coming-soon"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-purple-500/30 px-6 py-2.5"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Future Quests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Notifications />
            </TabsContent>

            <TabsContent value="coming-soon">
              <Card className="bg-black/20 border-white/10 overflow-hidden">
                <CardContent className="p-16 text-center relative">
                  {/* Background Effects */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                  <div className="relative">
                    <div className="relative mx-auto w-24 h-24 mb-8">
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
                      <div className="absolute inset-2 bg-violet-500/20 rounded-full blur-xl animate-pulse delay-500" />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center border border-purple-500/30 shadow-2xl">
                        <Sparkles className="h-12 w-12 text-purple-400 animate-pulse" />
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent mb-4">
                      Epic Adventures Await!
                    </h3>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
                      We're crafting extraordinary new features to enhance your journey through the Lost Realm. Prepare
                      for legendary quests, mystical discoveries, and powerful new abilities!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                      {[
                        { icon: Trophy, title: "Leaderboards", desc: "Compete with fellow explorers" },
                        { icon: Target, title: "Quest System", desc: "Complete challenges for rewards" },
                        { icon: Crown, title: "Premium Features", desc: "Unlock exclusive abilities" },
                      ].map((feature, index) => (
                        <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                          <feature.icon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                          <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                          <p className="text-sm text-slate-400">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
