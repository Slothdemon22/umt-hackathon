"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, Trophy, Sparkles, Target, Crown } from "lucide-react"
import { format } from "date-fns"
import { supabase } from "@/lib/db"
import { useUser } from "@clerk/nextjs"

interface Notification {
  id: number
  Activity: string
  created_at: string
  type: "success" | "info" | "warning" | "achievement"
}

const getNotificationType = (activity: string): "success" | "info" | "warning" | "achievement" => {
  if (activity.includes("approved")) return "success"
  if (activity.includes("rejected")) return "warning"
  if (activity.includes("discovered") || activity.includes("matching")) return "info"
  return "achievement"
}

const getNotificationIcon = (type: "success" | "info" | "warning" | "achievement") => {
  switch (type) {
    case "success":
      return Trophy
    case "info":
      return Sparkles
    case "warning":
      return Target
    case "achievement":
      return Crown
    default:
      return Bell
  }
}

export const Notifications = () => {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("notificationTable")
          .select("*")
          .eq("clerkID", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching notifications:", error)
          return
        }

        const processedNotifications = data.map(notification => ({
          ...notification,
          type: getNotificationType(notification.Activity)
        }))

        setNotifications(processedNotifications)
      } catch (error) {
        console.error("Error in fetchNotifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center p-8">
        <Bell className="h-8 w-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-400">No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => {
        const Icon = getNotificationIcon(notification.type)
        
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-black/20 border-white/10 hover:bg-white/5 hover:border-purple-500/20 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${
                      notification.type === "success"
                        ? "bg-emerald-500/20 group-hover:bg-emerald-500/30"
                        : notification.type === "info"
                        ? "bg-blue-500/20 group-hover:bg-blue-500/30"
                        : notification.type === "warning"
                        ? "bg-amber-500/20 group-hover:bg-amber-500/30"
                        : "bg-purple-500/20 group-hover:bg-purple-500/30"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${
                      notification.type === "success"
                        ? "text-emerald-400"
                        : notification.type === "info"
                        ? "text-blue-400"
                        : notification.type === "warning"
                        ? "text-amber-400"
                        : "text-purple-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 mt-1 leading-relaxed">{notification.Activity}</p>
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      {format(new Date(notification.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
} 