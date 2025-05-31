"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import {
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  Eye,
  Search,
  Filter,
  Clock,
  AlertCircle,
  ClipboardList,
  User,
  Mail,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Claim } from "@/types/types"

export const AdminClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch("/api/getClaims")
        if (!response.ok) throw new Error("Failed to fetch claims")
        const data = await response.json()
        setClaims(data)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch claims")
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [])

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.itemTable.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.founder.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || claim.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleClaimAction = async (claimId: number, action: "approve" | "reject") => {
    setProcessingId(claimId)
    try {
      const response = await fetch(`/api/processClaim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claimId, action }),
      })

      if (!response.ok) throw new Error(`Failed to ${action} claim`)

      setClaims(
        claims.map((claim) =>
          claim.id === claimId ? { ...claim, status: action === "approve" ? "approved" : "rejected" } : claim,
        ),
      )

      toast.success(`Claim ${action === "approve" ? "approved" : "rejected"} successfully`)
    } catch (error) {
      console.error("Error:", error)
      toast.error(`Failed to ${action} claim`)
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30"
      case "approved":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
      case "rejected":
        return "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-500/30"
    }
  }

  const getUserRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30"
      case "student":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-500/30"
    }
  }

  const ViewDetailsDialog = ({ claim }: { claim: Claim }) => (
    <DialogContent className="sm:max-w-[1000px] p-0 gap-0 bg-gradient-to-br from-black/95 to-black/80 backdrop-blur-2xl border-white/20 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/20">
        {/* Left side - Item Details */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl border border-purple-500/20">
              <Info className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Item Details
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Item Name</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white font-medium text-lg">{claim.itemTable.itemName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Category</h4>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-400/40">
                    {claim.itemTable.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Status</h4>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <Badge variant="outline" className={getStatusColor(claim.itemTable.status)}>
                    {claim.itemTable.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Location Found</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white">{claim.itemTable.location}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Date Lost</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white">{format(new Date(claim.itemTable.dateLost), "PPP")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Description</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white/90 text-sm leading-relaxed">{claim.itemTable.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Claim Details */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl border border-blue-500/20">
              <ClipboardList className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Claim Details
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Claimant Information</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20 space-y-3">
                <div className="flex items-center gap-3">
                  <p className="text-white font-medium">{claim.claimer.fullName}</p>
                  <Badge variant="outline" className={getUserRoleColor(claim.claimer.userRole)}>
                    {claim.claimer.userRole}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">{claim.claimer.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Original Owner</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20 space-y-3">
                <div className="flex items-center gap-3">
                  <p className="text-white font-medium">{claim.founder.fullName}</p>
                  <Badge variant="outline" className={getUserRoleColor(claim.founder.userRole)}>
                    {claim.founder.userRole}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">{claim.founder.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Claim Description</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white/90 text-sm leading-relaxed">{claim.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Claim Status</h4>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={`${getStatusColor(claim.status)} font-medium px-3 py-1`}>
                    {claim.status}
                  </Badge>
                  <p className="text-sm text-slate-300">Submitted on {format(new Date(claim.created_at), "PPP")}</p>
                </div>
              </div>
            </div>

            {claim.status === "pending" && (
              <div className="pt-6">
                <Separator className="mb-6 bg-white/20" />
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-200 hover:from-green-500/30 hover:to-emerald-500/30 hover:text-green-100 px-6"
                    disabled={processingId === claim.id}
                    onClick={() => handleClaimAction(claim.id, "approve")}
                  >
                    {processingId === claim.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve Claim
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/40 text-red-200 hover:from-red-500/30 hover:to-rose-500/30 hover:text-red-100 px-6"
                    disabled={processingId === claim.id}
                    onClick={() => handleClaimAction(claim.id, "reject")}
                  >
                    {processingId === claim.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject Claim
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )

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
              Loading claims...
            </p>
            <p className="text-slate-400 mt-2">Fetching claim data from the system</p>
          </div>
        </div>
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="p-12 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-3xl mb-8 border border-white/10 shadow-2xl">
          <AlertCircle className="w-16 h-16 text-blue-400 mx-auto" />
        </div>
        <h3 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
          No Claims Found
        </h3>
        <p className="text-slate-400 max-w-md text-lg leading-relaxed">
          There are currently no item claims to review. Claims will appear here when users submit them.
        </p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        {selectedClaim && <ViewDetailsDialog claim={selectedClaim} />}
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full space-y-8"
      >
        {/* Enhanced Header with Search and Filters */}
        <Card className="bg-gradient-to-r from-black/40 to-black/20 border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                  Item Claims
                </h2>
                <p className="text-slate-400">Review and process item ownership claims</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search claims..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 w-64"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/80 border-white/10 backdrop-blur-xl">
                    <DropdownMenuItem onClick={() => setFilterStatus("all")} className="text-white hover:bg-white/10">
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("pending")}
                      className="text-white hover:bg-white/10"
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("approved")}
                      className="text-white hover:bg-white/10"
                    >
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("rejected")}
                      className="text-white hover:bg-white/10"
                    >
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-base px-4 py-2">
                {filteredClaims.length} Claims
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-300 border-yellow-500/30">
                {claims.filter((c) => c.status === "pending").length} Pending
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
                {claims.filter((c) => c.status === "approved").length} Approved
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-300 border-red-500/30">
                {claims.filter((c) => c.status === "rejected").length} Rejected
              </Badge>
            </div>
          </div>
        </Card>

        {/* Enhanced Claims Table - Removed Popovers, Using Expandable Rows */}
        <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-blue-300 font-semibold text-base py-6 w-[25%]">Item Information</TableHead>
                  <TableHead className="text-blue-300 font-semibold text-base w-[20%]">Claimant</TableHead>
                  <TableHead className="text-blue-300 font-semibold text-base w-[20%]">Owner</TableHead>
                  <TableHead className="text-blue-300 font-semibold text-base w-[15%]">Claim Details</TableHead>
                  <TableHead className="text-blue-300 font-semibold text-base w-[10%] text-center">Status</TableHead>
                  <TableHead className="text-blue-300 font-semibold text-base w-[10%] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim, index) => (
                  <motion.tr
                    key={claim.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-white/10 hover:bg-white/5 transition-all duration-300 group"
                  >
                    <TableCell className="py-6">
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-white text-lg group-hover:text-blue-200 transition-colors">
                            {claim.itemTable.itemName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="bg-purple-500/20 text-purple-200 border-purple-400/40 text-xs"
                            >
                              {claim.itemTable.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{claim.itemTable.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{format(new Date(claim.itemTable.dateLost), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="text-white font-medium">{claim.claimer.fullName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-300 truncate">{claim.claimer.email}</p>
                        </div>
                        <Badge variant="outline" className={`${getUserRoleColor(claim.claimer.userRole)} text-xs`}>
                          {claim.claimer.userRole}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="text-white font-medium">{claim.founder.fullName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-300 truncate">{claim.founder.email}</p>
                        </div>
                        <Badge variant="outline" className={`${getUserRoleColor(claim.founder.userRole)} text-xs`}>
                          {claim.founder.userRole}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <p className="text-sm text-slate-300 line-clamp-2">{claim.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {format(new Date(claim.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-6">
                      <Badge variant="outline" className={`${getStatusColor(claim.status)} font-medium px-3 py-1`}>
                        {claim.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center py-6">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-300 hover:from-blue-500/20 hover:to-cyan-500/20 hover:text-blue-200 w-9 h-9 p-0"
                              onClick={() => setSelectedClaim(claim)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black/90 border-white/20 text-white">
                            <p>View Full Details</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-300 hover:from-green-500/20 hover:to-emerald-500/20 hover:text-green-200 w-9 h-9 p-0"
                              disabled={claim.status !== "pending" || processingId === claim.id}
                              onClick={() => handleClaimAction(claim.id, "approve")}
                            >
                              {processingId === claim.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black/90 border-white/20 text-white">
                            <p>Approve claim</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/30 text-red-300 hover:from-red-500/20 hover:to-rose-500/20 hover:text-red-200 w-9 h-9 p-0"
                              disabled={claim.status !== "pending" || processingId === claim.id}
                              onClick={() => handleClaimAction(claim.id, "reject")}
                            >
                              {processingId === claim.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black/90 border-white/20 text-white">
                            <p>Reject claim</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}
