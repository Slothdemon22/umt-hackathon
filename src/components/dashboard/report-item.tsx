"use client"

import type React from "react"
import { Search } from "lucide-react" // Import Search component

import { useState } from "react"
import { supabase } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, ImageIcon, FileText, MapPin, Calendar, Tag, Sparkles, Hand, Star, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "@/components/ui/calendar"
import { Dropzone } from "@/components/ui/dropzone"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ItemStatus } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { findBestImageMatch } from "@/lib/matchImages"

interface FormData {
  itemName: string
  category: string
  description: string
  dateLost: string
  location: string
  status: ItemStatus
}

interface MatchResult {
  url: string
  description: string
  matchReason: string
  confidence: string
}

export const ReportItem = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [matchLoading, setMatchLoading] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    category: "",
    description: "",
    dateLost: "",
    location: "",
    status: ItemStatus.FOUND,
  })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log("File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      })

      setFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      console.log("Preview URL created:", url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submission started")
    console.log("Form data:", formData)

    if (!user) {
      console.error("No user found - submission blocked")
      toast.error("You must be logged in to report an item")
      return
    }

    // Check if user exists in Supabase
    const { data: userData, error: userError } = await supabase
      .from("userTable")
      .select("clerkID")
      .eq("clerkID", user.id)
      .single()

    if (userError || !userData) {
      console.error("User not found in database:", userError)
      toast.error("Please wait while we set up your account")
      return
    }

    // Check if image is required for found items
    if (formData.status === ItemStatus.FOUND && !file) {
      toast.error("Please upload an image of the found item")
      return
    }

    setLoading(true)
    setMatchLoading(true)

    try {
      // If it's a lost item, search for matches first
      if (formData.status === ItemStatus.LOST) {
        console.log("Searching for matches...")
        try {
          const result = await findBestImageMatch(formData.description)
          console.log("Match result:", result)

          // Ensure we set the match result before proceeding
          setMatchResult(result)
          setMatchLoading(false)

          if (result && result.confidence !== "low") {
            toast.success("We found potential matches for your lost item!")
            // Return early to prevent form reset and keep the matches visible
            return
          }
        } catch (error) {
          console.error("Error finding matches:", error)
          toast.error("Failed to find matching items")
        }
      }

      let imageUrl = ""

      if (file) {
        console.log("Starting file upload process")
        console.log("File details:", {
          name: file.name,
          size: file.size,
          type: file.type,
        })

        const filename = `/${Math.random() * 100 + file.name}`
        console.log("Generated filename:", filename)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("umt-bucket")
          .upload(filename, file)

        if (uploadError) {
          console.error("File upload error:", uploadError)
          throw new Error(uploadError.message)
        }

        console.log("File uploaded successfully:", uploadData)

        const { data: urlData } = supabase.storage.from("umt-bucket").getPublicUrl(filename)

        if (!urlData || !urlData.publicUrl) {
          console.error("Failed to get public URL")
          throw new Error("Failed to get public URL")
        }

        imageUrl = urlData.publicUrl
        console.log("Public URL generated:", imageUrl)
      }

      const itemData = {
        clerkID: user.id,
        ...formData,
        imageUrl,
        created_at: new Date().toISOString(),
      }

      console.log("Preparing to insert item data:", itemData)

      const { error: insertError } = await supabase.from("itemTable").insert([itemData])

      if (insertError) {
        console.error("Database insertion error:", insertError)
        throw insertError
      }

      console.log("Item successfully inserted into database")
      toast.success("Item reported successfully!")

      // Only reset form if it's not a lost item with matches
      if (formData.status !== ItemStatus.LOST || !matchResult || matchResult.confidence === "low") {
        setFormData({
          itemName: "",
          category: "",
          description: "",
          dateLost: "",
          location: "",
          status: ItemStatus.FOUND,
        })
        setFile(null)
        setPreviewUrl(null)
        setMatchResult(null)

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      toast.error("Failed to report item. Please try again.")
    } finally {
      setLoading(false)
      setMatchLoading(false)
    }
  }

  // Update status change handler to just reset match result
  const handleStatusChange = (value: ItemStatus) => {
    setFormData({ ...formData, status: value })
    if (value !== ItemStatus.LOST) {
      setMatchResult(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative space-y-8"
    >
      {/* Enhanced decorative elements */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>

      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <CardHeader className="space-y-2 pb-10 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600/30 to-violet-600/30 rounded-2xl border border-purple-500/30 shadow-lg">
              <Wand2 className="w-7 h-7 text-purple-300" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                Report a Lost Treasure
              </CardTitle>
              <p className="text-slate-400 text-lg mt-1">
                Help others find your lost magical item by providing detailed information
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Item Name and Category in first row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  Item Name*
                </label>
                <Input
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="Name of the magical item"
                  className="bg-black/40 border-white/20 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 h-14 text-white rounded-xl text-lg"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                  <Tag className="w-4 h-4" />
                  Category*
                </label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Item category"
                  className="bg-black/40 border-white/20 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 h-14 text-white rounded-xl text-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                Description*
              </label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the magical item in detail..."
                className="min-h-[140px] bg-black/40 border-white/20 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 text-white rounded-xl text-lg"
              />
            </div>

            {/* Status */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                <Star className="w-4 h-4" />
                Status*
              </label>
              <Select value={formData.status} onValueChange={handleStatusChange} required>
                <SelectTrigger className="bg-black/40 border-white/20 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 h-14 text-white rounded-xl text-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                  <SelectItem value={ItemStatus.FOUND} className="text-white hover:bg-white/10 text-lg">
                    Found
                  </SelectItem>
                  <SelectItem value={ItemStatus.LOST} className="text-white hover:bg-white/10 text-lg">
                    Lost
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Location in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  Date*
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal bg-black/40 border-white/20 hover:bg-white/10 hover:border-purple-500/40 rounded-xl text-lg",
                        !date && "text-slate-500",
                      )}
                    >
                      <Calendar className="mr-3 h-5 w-5 text-purple-400" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-xl border-white/20" align="start">
                    <CalendarIcon
                      mode="single"
                      selected={date}
                      onSelect={(newDate: Date | undefined) => {
                        setDate(newDate)
                        setFormData({ ...formData, dateLost: newDate ? newDate.toISOString() : "" })
                      }}
                      initialFocus
                      className="bg-black/90 text-white"
                      required
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  Location*
                </label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Where was it lost/found?"
                  className="bg-black/40 border-white/20 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 h-14 text-white rounded-xl text-lg"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4" />
                Image{formData.status === ItemStatus.FOUND ? "*" : " (Optional)"}
              </label>
              <Dropzone
                onFileSelect={(file) => {
                  setFile(file)
                  const url = URL.createObjectURL(file)
                  setPreviewUrl(url)
                }}
                preview={previewUrl || undefined}
                disabled={loading}
                className="min-h-[240px] bg-black/40 border-white/20 hover:border-purple-500/40 transition-all duration-300 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-16 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 
              hover:to-violet-500 text-white shadow-xl shadow-purple-500/30 rounded-2xl transition-all duration-300
              hover:shadow-purple-500/50 hover:scale-[1.01] border-0 mt-10 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Reporting...
                </>
              ) : (
                <>
                  <Upload className="mr-3 h-6 w-6" />
                  {formData.status === ItemStatus.LOST ? "Report Lost Item" : "Report Found Item"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Enhanced Matching Items Section */}
      {formData.status === ItemStatus.LOST && (matchLoading || matchResult) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="space-y-2 pb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-2xl border border-green-500/30 shadow-lg">
                  <Sparkles className="w-7 h-7 text-green-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent">
                    {matchLoading ? "Searching Matches..." : "Potential Matches"}
                  </CardTitle>
                  <p className="text-slate-400 text-lg mt-1">
                    {matchLoading
                      ? "We're analyzing found items to find potential matches..."
                      : matchResult
                        ? matchResult.confidence === "low"
                          ? "No matching items found yet"
                          : "We found a potential match for your item"
                        : "Submit your lost item report to see potential matches"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-10">
              {matchLoading ? (
                <div className="flex items-center justify-center h-[240px]">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-green-400" />
                    <p className="text-green-300 font-medium">Searching the magical realm...</p>
                  </div>
                </div>
              ) : matchResult && (matchResult.confidence === "high" || matchResult.confidence === "medium") ? (
                <div className="space-y-6">
                  <div className="p-6 bg-white/10 rounded-2xl border border-white/20 hover:border-green-500/40 transition-all duration-300">
                    <div className="flex gap-6">
                      <div className="w-40 h-40 rounded-2xl overflow-hidden bg-black/40 flex-shrink-0">
                        {matchResult.url ? (
                          <>
                            {console.log("Attempting to display image with URL:", matchResult.url)}
                            <img
                              src={matchResult.url || "/placeholder.svg"}
                              alt="Matching item"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error("Error loading image:", e)
                                const target = e.target as HTMLImageElement
                                target.onerror = null
                                target.style.display = "none"
                                const parent = target.parentElement
                                if (parent) {
                                  const fallback = document.createElement("div")
                                  fallback.className = "w-full h-full flex items-center justify-center"
                                  fallback.innerHTML =
                                    '<svg class="w-10 h-10 text-red-500/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
                                  parent.appendChild(fallback)
                                }
                              }}
                              style={{ display: "block" }}
                            />
                          </>
                        ) : (
                          <>
                            {console.log("No image URL in match result, showing placeholder")}
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-10 h-10 text-green-500/50" />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={cn(
                              "bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-200 border-green-500/40 px-4 py-2 text-sm font-medium",
                              matchResult.confidence === "medium" &&
                                "from-blue-500/30 to-cyan-500/30 text-blue-200 border-blue-500/40",
                            )}
                          >
                            {matchResult.confidence.charAt(0).toUpperCase() + matchResult.confidence.slice(1)}{" "}
                            Confidence Match
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/20 px-6 h-10 rounded-xl"
                            onClick={() => {
                              // Here you can implement the claim logic
                              toast.success("Claim request sent!", {
                                description: "We'll notify the finder about your claim.",
                              })
                            }}
                          >
                            <Hand className="w-4 h-4 mr-2" />
                            Claim This Item
                          </Button>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 space-y-3 border border-white/10">
                          <p className="text-sm text-slate-300 font-medium uppercase tracking-wider">Description</p>
                          <p className="text-white/90">{matchResult.description}</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 space-y-3 border border-white/10">
                          <p className="text-sm text-slate-300 font-medium uppercase tracking-wider">Match Reason</p>
                          <p className="text-green-300 font-medium">{matchResult.matchReason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <div className="p-8 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-2xl mb-6 border border-slate-500/30 inline-block">
                    <Search className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-lg">
                    {matchResult?.confidence === "low"
                      ? "No strong matches found for your item yet. We'll keep looking!"
                      : "Fill out the form above to find potential matches"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
