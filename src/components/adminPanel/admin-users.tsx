"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Loader2, UserCog, Search, Filter, MoreHorizontal, Mail, Calendar } from 'lucide-react'
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/types"

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers")
        if (!response.ok) throw new Error("Failed to fetch users")
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.userRole.toLowerCase() === filterRole.toLowerCase()
    return matchesSearch && matchesRole
  })

  const getUserRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30"
      case "student":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-500/30"
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
      : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/30"
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
              Loading users...
            </p>
            <p className="text-slate-400 mt-2">Fetching user data from the system</p>
          </div>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="p-12 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-3xl mb-8 border border-white/10 shadow-2xl">
          <UserCog className="w-16 h-16 text-purple-400 mx-auto" />
        </div>
        <h3 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
          No Users Found
        </h3>
        <p className="text-slate-400 max-w-md text-lg leading-relaxed">
          There are currently no users registered in the system. Users will appear here once they sign up.
        </p>
      </div>
    )
  }

  return (
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                System Users
              </h2>
              <p className="text-slate-400">Manage and monitor all registered users</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 w-64"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter Role
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/80 border-white/10 backdrop-blur-xl">
                  <DropdownMenuItem onClick={() => setFilterRole("all")} className="text-white hover:bg-white/10">
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("admin")} className="text-white hover:bg-white/10">
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("student")} className="text-white hover:bg-white/10">
                    Student
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-base px-4 py-2">
              {filteredUsers.length} Users
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
              {users.filter(u => u.isActive).length} Active
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
              {users.filter(u => u.userRole === "admin").length} Admins
            </Badge>
          </div>
        </div>
      </Card>

      {/* Enhanced Users Table */}
      <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-purple-300 font-semibold text-base py-6">User</TableHead>
                <TableHead className="text-purple-300 font-semibold text-base">Contact</TableHead>
                <TableHead className="text-purple-300 font-semibold text-base">Role</TableHead>
                <TableHead className="text-purple-300 font-semibold text-base">Status</TableHead>
                <TableHead className="text-purple-300 font-semibold text-base">Joined</TableHead>
                <TableHead className="text-purple-300 font-semibold text-base text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.clerkID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-white/10 hover:bg-white/5 transition-all duration-300 group"
                >
                  <TableCell className="py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-white/10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-white font-semibold">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white text-lg group-hover:text-purple-200 transition-colors">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-slate-400 font-mono">ID: {user.clerkID.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-6">
                    <Badge variant="outline" className={`${getUserRoleColor(user.userRole)} font-medium px-3 py-1`}>
                      {user.userRole}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-6">
                    <Badge variant="outline" className={`${getStatusColor(user.isActive)} font-medium px-3 py-1`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(user.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-6 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-white/10">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/80 border-white/10 backdrop-blur-xl">
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-300 hover:bg-red-500/10">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  )
}
