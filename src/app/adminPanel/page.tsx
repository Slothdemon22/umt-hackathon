"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ClipboardList, Sparkles, Shield, TrendingUp } from 'lucide-react'
import { AdminUsers } from "@/components/adminPanel/admin-users"
import { AdminClaims } from "@/components/adminPanel/admin-claims"
import { EmptyTab } from "@/components/dashboard/empty-tab"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState("users")

  const renderActiveTab = () => {
    switch (activeTab) {
      case "users":
        return <AdminUsers />
      case "claims":
        return <AdminClaims />
      case "analytics":
        return <EmptyTab />
      default:
        return <AdminUsers />
    }
  }

  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, color: "text-blue-400" },
    { label: "Pending Claims", value: "23", icon: ClipboardList, color: "text-yellow-400" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-green-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Space for navbar */}
      <div className="h-20" />
      
      {/* Enhanced Admin Panel Header */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-slate-400 text-xl mt-2 max-w-2xl">
                Comprehensive system management and oversight dashboard
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="bg-black/20 border-white/10 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Admin Panel Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-12">
            <TabsList className="inline-flex h-16 items-center text-base rounded-3xl bg-black/20 p-2 backdrop-blur-xl border border-white/10 shadow-2xl">
              <TabsTrigger 
                value="users"
                className="relative h-12 rounded-2xl px-8 font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white group"
              >
                <Users className="w-5 h-5 mr-3 group-data-[state=active]:text-purple-400" />
                Manage Users
                {activeTab === "users" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20" />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="claims"
                className="relative h-12 rounded-2xl px-8 font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white group"
              >
                <ClipboardList className="w-5 h-5 mr-3 group-data-[state=active]:text-blue-400" />
                Review Claims
                <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                  23
                </Badge>
                {activeTab === "claims" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-blue-500/20" />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="relative h-12 rounded-2xl px-8 font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white group"
              >
                <Sparkles className="w-5 h-5 mr-3 group-data-[state=active]:text-cyan-400" />
                Analytics
                <Badge className="ml-2 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                  Soon
                </Badge>
                {activeTab === "analytics" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-cyan-500/20" />
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Enhanced Tab Content with Animation */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {renderActiveTab()}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPanelPage
