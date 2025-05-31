"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrowseItems } from "@/components/dashboard/browse-items"
import { ReportItem } from "@/components/dashboard/report-item"
import { UserActivity } from "@/components/dashboard/user-activity"
import { EmptyTab } from "@/components/dashboard/empty-tab"
import { Search, Upload, Compass, Star, User } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("browse")

  const renderActiveTab = () => {
    switch (activeTab) {
      case "browse":
        return <BrowseItems />
      case "report":
        return <ReportItem />
      case "activity":
        return <UserActivity />
      case "empty":
        return <EmptyTab />
      default:
        return <BrowseItems />
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const stats = [
    {
      label: "Items Discovered",
      value: "247",
      icon: Search,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      label: "Successfully Reunited",
      value: "89",
      icon: Star,
      color: "text-green-400",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      label: "Active Seekers",
      value: "156",
      icon: User,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-violet-500/20",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full" />
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-1500" />
      </div>

      {/* Space for navbar */}
      <div className="h-20" />

      {/* Enhanced Dashboard Header */}
      <div className="relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <div className="container mx-auto px-6 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Enhanced Decorative Elements */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-500/50 to-purple-500/80" />
              <div className="p-4 bg-gradient-to-br from-purple-600/30 to-violet-600/30 rounded-2xl border border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/20">
                <Compass className="w-8 h-8 text-purple-300" />
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-purple-500/50 to-purple-500/80" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent mb-8 tracking-tight">
              Command Center
            </h1>

            <div className="flex items-center justify-center gap-3 mb-10">
              <Star className="w-5 h-5 text-purple-400 animate-pulse" />
              <p className="text-slate-300 text-2xl font-medium tracking-wide">Lost Realm Dashboard</p>
              <Star className="w-5 h-5 text-purple-400 animate-pulse delay-500" />
            </div>

            <p className="text-slate-400 text-xl leading-relaxed max-w-3xl mx-auto mb-16">
              Navigate through the mysteries of lost treasures across the realm. Help fellow adventurers reunite with
              their precious belongings and discover new quests in this magical journey.
            </p>

            {/* Enhanced Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="bg-black/30 backdrop-blur-xl border-white/20 hover:border-purple-500/40 transition-all duration-500 group shadow-2xl hover:shadow-purple-500/20">
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-transform duration-300 border border-white/10`}
                        >
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-white group-hover:text-purple-200 transition-colors">
                            {stat.value}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">
                        {stat.label}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Dashboard Content */}
      <div className="container mx-auto px-6 py-16 relative">
        <Tabs defaultValue="browse" className="w-full" onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-16"
          >
            <TabsList className="inline-flex h-18 items-center text-base rounded-3xl bg-black/30 backdrop-blur-2xl p-2 border border-white/20 shadow-2xl shadow-purple-500/20">
              <TabsTrigger
                value="browse"
                className="relative h-14 rounded-2xl px-10 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-violet-600/40 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/30 data-[state=active]:border data-[state=active]:border-purple-500/40 hover:text-white hover:bg-white/10 text-slate-300 group"
              >
                <Compass className="w-5 h-5 mr-3 group-data-[state=active]:text-purple-300" />
                Browse Realm
                {activeTab === "browse" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/30" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="report"
                className="relative h-14 rounded-2xl px-10 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-violet-600/40 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/30 data-[state=active]:border data-[state=active]:border-purple-500/40 hover:text-white hover:bg-white/10 text-slate-300 group"
              >
                <Upload className="w-5 h-5 mr-3 group-data-[state=active]:text-blue-300" />
                Report Item
                {activeTab === "report" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-blue-500/30" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="relative h-14 rounded-2xl px-10 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-violet-600/40 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/30 data-[state=active]:border data-[state=active]:border-purple-500/40 hover:text-white hover:bg-white/10 text-slate-300 group"
              >
                <User className="w-5 h-5 mr-3 group-data-[state=active]:text-green-300" />
                My Activity
                {activeTab === "activity" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-green-500/30" />
                )}
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Enhanced Tab Content with Animation */}
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Enhanced Content Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent rounded-3xl" />

            {/* Enhanced Content Container */}
            <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-2xl shadow-black/30">
              {renderActiveTab()}
            </div>
          </motion.div>
        </Tabs>
      </div>

      {/* Bottom Spacing */}
      <div className="h-24" />
    </div>
  )
}

export default DashboardPage
