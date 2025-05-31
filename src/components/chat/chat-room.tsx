"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/db"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageCircle, X, Users, Clock } from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  created_at: string
  message: string
  clerkID: string
  itemID: number
  user: {
    fullName: string | null
  } | null
}

interface ChatRoomProps {
  itemID: number
  onClose?: () => void
}

export const ChatRoom = ({ itemID, onClose }: ChatRoomProps) => {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch initial messages and set up subscription
  useEffect(() => {
    let chatChannel: ReturnType<typeof supabase.channel> | null = null

    const fetchMessagesAndSubscribe = async () => {
      try {
        // Fetch existing messages for the item
        const { data, error } = await supabase
          .from("chatTable")
          .select(
            `
            *,
            user:userTable!inner(
              fullName
            )
          `,
          )
          .eq("itemID", itemID)
          .order("created_at", { ascending: true })

        if (error) throw error

        setMessages(data || [])
        setLoading(false)

        // Set up real-time subscription
        chatChannel = supabase
          .channel(`chatroom-${itemID}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "chatTable",
            },
            async (payload) => {
              if (payload.new.itemID !== itemID) return // Only update for current room

              const { data: userData } = await supabase
                .from("userTable")
                .select("fullName")
                .eq("clerkID", payload.new.clerkID)
                .single()

              const newMsg: Message = {
                id: payload.new.id,
                created_at: payload.new.created_at,
                message: payload.new.message,
                clerkID: payload.new.clerkID,
                itemID: payload.new.itemID,
                user: userData,
              }

              setMessages((prev) => [...prev, newMsg])
            },
          )
          .subscribe()
      } catch (err) {
        console.error("Error loading chat:", err)
        setLoading(false)
      }
    }

    fetchMessagesAndSubscribe()

    return () => {
      if (chatChannel) {
        chatChannel.unsubscribe()
      }
    }
  }, [itemID])

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setIsTyping(true)

    try {
      // First get the item owner's clerkID
      const { data: itemData, error: itemError } = await supabase
        .from("itemTable")
        .select("clerkID, itemName")
        .eq("id", itemID)
        .single()

      if (itemError) {
        console.error("Error fetching item:", itemError)
        return
      }

      // Send the message
      const { error: messageError } = await supabase.from("chatTable").insert({
        message: newMessage.trim(),
        clerkID: user.id,
        itemID: itemID,
      })

      if (messageError) throw messageError

      // Only create notification if the message sender is not the item owner
      if (user.id !== itemData.clerkID) {
        const { error: notificationError } = await supabase
          .from("notificationTable")
          .insert({
            clerkID: itemData.clerkID,
            Activity: `New message from ${user.fullName || 'Unknown User'} in chat for "${itemData.itemName}"`
          })

        if (notificationError) {
          console.error("Error creating notification:", notificationError)
        }
      }

      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setIsTyping(false)
    }
  }

  const uniqueUsers = new Set(messages.map((msg) => msg.clerkID)).size

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-purple-500/10 overflow-hidden">
        {/* Enhanced Header */}
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-purple-600/10 to-violet-600/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <MessageCircle className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                  Realm Chat
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {uniqueUsers} {uniqueUsers === 1 ? "Explorer" : "Explorers"}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Active
                  </div>
                </div>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="p-0 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

          <ScrollArea className="h-[400px] relative" ref={scrollAreaRef}>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-[360px]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                      <div className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-purple-400 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
                    </div>
                    <p className="text-purple-300 animate-pulse font-medium">Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[360px] text-center">
                  <div className="p-6 bg-purple-500/10 rounded-full mb-4 border border-purple-500/20">
                    <MessageCircle className="h-8 w-8 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Start the Conversation</h4>
                  <p className="text-slate-400 max-w-sm">
                    No messages yet. Be the first to send a message in this realm chat!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isOwn = message.clerkID === user?.id
                      const showAvatar = index === 0 || messages[index - 1].clerkID !== message.clerkID
                      const isLastFromUser =
                        index === messages.length - 1 || messages[index + 1].clerkID !== message.clerkID

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={cn("flex items-end gap-3", isOwn ? "flex-row-reverse" : "")}
                        >
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            {showAvatar ? (
                              <Avatar className="h-10 w-10 border-2 border-white/10 shadow-lg">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white font-semibold">
                                  {message.user?.fullName?.[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-10 h-10" />
                            )}
                          </div>

                          {/* Message Content */}
                          <div className={cn("flex flex-col max-w-[70%]", isOwn ? "items-end" : "items-start")}>
                            {/* User Name */}
                            {showAvatar && (
                              <div className={cn("flex items-center gap-2 mb-1", isOwn ? "flex-row-reverse" : "")}>
                                <span className="text-sm font-medium text-purple-300">
                                  {isOwn ? "You" : message.user?.fullName || "Unknown Explorer"}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {format(new Date(message.created_at), "h:mm a")}
                                </span>
                              </div>
                            )}

                            {/* Message Bubble */}
                            <div
                              className={cn(
                                "px-4 py-3 rounded-2xl backdrop-blur-sm border transition-all duration-200 hover:scale-[1.02]",
                                isOwn
                                  ? "bg-gradient-to-r from-purple-600/30 to-violet-600/30 text-white border-purple-500/30 shadow-lg shadow-purple-500/20"
                                  : "bg-white/10 text-white border-white/10 shadow-lg shadow-black/20",
                                !showAvatar && isOwn ? "rounded-tr-md" : "",
                                !showAvatar && !isOwn ? "rounded-tl-md" : "",
                                isLastFromUser && isOwn ? "rounded-br-md" : "",
                                isLastFromUser && !isOwn ? "rounded-bl-md" : "",
                              )}
                            >
                              <p className="text-sm leading-relaxed break-words">{message.message}</p>
                            </div>

                            {/* Timestamp for non-avatar messages */}
                            {!showAvatar && isLastFromUser && (
                              <span className="text-xs text-slate-500 mt-1 px-1">
                                {format(new Date(message.created_at), "h:mm a")}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white">
                          {user?.firstName?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Enhanced Input Area */}
        <CardFooter className="p-6 border-t border-white/10">
          <form onSubmit={handleSendMessage} className="flex w-full gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Share your thoughts with fellow explorers..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 rounded-xl h-12 pr-12 backdrop-blur-sm"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Clock className="h-4 w-4 text-white/30" />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!newMessage.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/30 border-0 rounded-xl h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
