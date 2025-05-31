"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/db"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Eye,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Clock,
  User,
  Hand,
  Sparkles,
  X,
  Loader2,
  Search,
  MessageCircle,
  Star,
} from "lucide-react"
import { format, isValid, parseISO } from "date-fns"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@clerk/nextjs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ItemStatus } from "@/types/types"
import { ItemFilters } from "@/components/dashboard/item-filters"
import { ChatRoom } from "@/components/chat/chat-room"

interface LostItem {
  id: number
  itemName: string
  itemType: string
  category: string
  description: string
  dateLost: string
  location: string
  imageUrl: string
  status: string
  created_at: string
  clerkID: string
}

interface DialogState {
  type: "details" | "claim" | "chat" | null
  item: LostItem | null
}

// Add a helper function to safely format dates
const formatDate = (dateString: string, formatStr = "MMM d") => {
  try {
    const date = parseISO(dateString)
    return isValid(date) ? format(date, formatStr) : "Invalid date"
  } catch (error) {
    return "Invalid date"
  }
}

export const BrowseItems = () => {
  const [items, setItems] = useState<LostItem[]>([])
  const [filteredItems, setFilteredItems] = useState<LostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null)
  const [claimMode, setClaimMode] = useState(false)
  const [claimDescription, setClaimDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFilter, setActiveFilter] = useState<ItemStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useUser()
  const [dialogState, setDialogState] = useState<DialogState>({ type: null, item: null })

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let query = supabase.from("itemTable").select("*").order("created_at", { ascending: false })

        // Apply status filter if not "all"
        if (activeFilter !== "all") {
          query = query.eq("status", activeFilter)
        }

        const { data, error } = await query

        if (error) throw error

        setItems(data || [])
        setFilteredItems(data || [])
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [activeFilter])

  // Search and filter effect
  useEffect(() => {
    const filtered = items.filter((item) => {
      const searchString = searchQuery.toLowerCase()
      return (
        item.itemName.toLowerCase().includes(searchString) ||
        item.category.toLowerCase().includes(searchString) ||
        item.location.toLowerCase().includes(searchString) ||
        item.description.toLowerCase().includes(searchString)
      )
    })
    setFilteredItems(filtered)
  }, [searchQuery, items])

  // Calculate counts based on filtered items
  const counts = {
    all: filteredItems.length,
    lost: filteredItems.filter((item) => item.status === ItemStatus.LOST).length,
    found: filteredItems.filter((item) => item.status === ItemStatus.FOUND).length,
    claimed: filteredItems.filter((item) => item.status === ItemStatus.CLAIMED).length,
  }

  const handleClaimSubmit = async () => {
    if (!dialogState.item || !claimDescription.trim() || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemID: dialogState.item.id,
          description: claimDescription,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit claim")
      }

      toast.success("Claim submitted successfully", {
        description: "The owner will review your claim.",
      })
      setDialogState({ type: null, item: null })
      setClaimDescription("")
    } catch (error) {
      toast.error("Error submitting claim", {
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
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
              Discovering lost treasures...
            </p>
            <p className="text-slate-400 mt-2">Searching the realm for magical items</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Enhanced Header with Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
              Treasure Vault
            </h2>
            <p className="text-slate-400">Discover lost items and help reunite them with their owners</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <ItemFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search magical items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 rounded-xl"
              />
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-8 border border-purple-500/30">
                <Tag className="w-16 h-16 text-purple-400" />
              </div>
              <h3 className="text-3xl font-semibold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {searchQuery ? "No matching treasures found" : "The Vault Awaits"}
              </h3>
              <p className="text-slate-400 max-w-md text-lg text-center leading-relaxed">
                {searchQuery
                  ? `No magical items match your search for "${searchQuery}"`
                  : "No lost treasures have been reported yet. Be the first to report a missing magical item."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/20 hover:border-purple-500/40 transition-all duration-500 group shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
                  <div className="aspect-video relative overflow-hidden bg-black/40">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.itemName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-black/50">
                        <FileText className="w-12 h-12 text-purple-500/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Badge
                      className={cn("absolute top-4 right-4 border font-medium px-3 py-1", getStatusColor(item.status))}
                    >
                      {item.status}
                    </Badge>
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white truncate group-hover:text-purple-300 transition-colors duration-300 mb-3">
                      {item.itemName}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span>{formatDate(item.dateLost)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-white/10 border-white/20 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-300 transition-all duration-300 h-11"
                      onClick={() => setDialogState({ type: "details", item })}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-white/10 border-white/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 transition-all duration-300 h-11"
                      onClick={() => setDialogState({ type: "chat", item })}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-gradient-to-r from-purple-600/30 to-violet-600/30 border-purple-500/40 hover:from-purple-600/40 hover:to-violet-600/40 text-purple-300 hover:text-purple-200 transition-all duration-300 h-11"
                      onClick={() => setDialogState({ type: "claim", item })}
                    >
                      <Hand className="w-4 h-4 mr-2" />
                      Claim
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!dialogState.item} onOpenChange={() => setDialogState({ type: null, item: null })}>
        <DialogContent
          className="sm:max-w-[1000px] p-0 gap-0 bg-transparent border-0 shadow-none flex items-center justify-center"
          showCloseButton={false}
        >
          {dialogState.item && dialogState.type === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden w-full shadow-2xl">
              {/* Left side - Image */}
              <div className="relative h-full min-h-[300px] lg:min-h-[600px] bg-black/50 flex items-center justify-center p-8">
                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black/40 shadow-2xl">
                  {dialogState.item.imageUrl ? (
                    <img
                      src={dialogState.item.imageUrl || "/placeholder.svg"}
                      alt={dialogState.item.itemName}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-black/50">
                      <FileText className="w-20 h-20 text-purple-500/50" />
                    </div>
                  )}
                  <Badge
                    className={cn(
                      "absolute top-6 right-6 border font-medium px-4 py-2",
                      getStatusColor(dialogState.item.status),
                    )}
                  >
                    {dialogState.item.status}
                  </Badge>

                  {/* Enhanced decorative elements */}
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute -top-8 -left-8 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>
                </div>
              </div>

              {/* Right side - Details */}
              <div className="p-10 bg-black/50 relative">
                <DialogClose className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all duration-300">
                  <X className="h-5 w-5" />
                </DialogClose>

                <DialogHeader className="mb-8">
                  <DialogTitle className="text-3xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                    {dialogState.item.itemName}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-lg">Magical treasure details</DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Main Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                      <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                        <Tag className="w-4 h-4" />
                        Type
                      </h4>
                      <p className="text-white font-medium">{dialogState.item.itemType}</p>
                    </div>
                    <div className="space-y-3 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                      <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                        <FileText className="w-4 h-4" />
                        Category
                      </h4>
                      <p className="text-white font-medium">{dialogState.item.category}</p>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Location and Date */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                      <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                        <MapPin className="w-4 h-4" />
                        Location
                      </h4>
                      <p className="text-white font-medium">{dialogState.item.location}</p>
                    </div>
                    <div className="space-y-3 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                      <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        Date Lost
                      </h4>
                      <p className="text-white font-medium">{formatDate(dialogState.item.dateLost, "PPP")}</p>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Description */}
                  <div className="space-y-3 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                    <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                      <FileText className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-white/90 leading-relaxed">{dialogState.item.description}</p>
                  </div>

                  {/* Footer Information */}
                  <div className="pt-6">
                    <Separator className="bg-white/20 mb-6" />
                    <div className="flex flex-col gap-3 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Reported on {formatDate(dialogState.item.created_at, "PPP")}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {dialogState.item.clerkID === user?.id ? "Reported by you" : "Reported by another adventurer"}
                      </div>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <Button
                    onClick={() => setDialogState({ type: "claim", item: dialogState.item })}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 border-0 rounded-xl text-lg font-medium"
                  >
                    <Hand className="w-5 h-5 mr-3" />
                    Claim This Treasure
                  </Button>
                </div>
              </div>
            </div>
          )}

          {dialogState.item && dialogState.type === "claim" && (
            <div className="bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden w-full shadow-2xl">
              <div className="p-10 relative">
                <DialogHeader className="mb-8">
                  <DialogTitle className="text-3xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                    Claim "{dialogState.item.itemName}"
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-lg">
                    To claim this magical treasure, please provide specific details that would prove your ownership.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-10 relative">
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>

                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-purple-500/30 rounded-full border border-purple-500/40">
                        <Sparkles className="w-6 h-6 text-purple-300" />
                      </div>
                      <p className="text-white/90 font-medium">
                        Describe unique details only the true owner would know
                      </p>
                    </div>

                    <Textarea
                      placeholder="Describe specific details about the item that only the owner would know (e.g., unique marks, contents, or when and where you lost it)..."
                      value={claimDescription}
                      onChange={(e) => setClaimDescription(e.target.value)}
                      className="min-h-[200px] bg-black/40 border-white/20 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 text-white rounded-xl"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-10 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDialogState({ type: "details", item: dialogState.item })
                      setClaimDescription("")
                    }}
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 h-12 px-8"
                  >
                    Back to Details
                  </Button>
                  <Button
                    onClick={handleClaimSubmit}
                    disabled={!claimDescription.trim() || isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 border-0 h-12 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Hand className="mr-2 h-5 w-5" />
                        Submit Claim
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}

          {dialogState.item && dialogState.type === "chat" && (
            <div className="flex items-center justify-center w-full">
              <ChatRoom itemID={dialogState.item.id} onClose={() => setDialogState({ type: null, item: null })} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
