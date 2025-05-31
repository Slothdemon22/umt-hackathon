"use client"

import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs"
import {
  ArrowRight,
  Search,
  PlusCircle,
  Bell,
  Sparkles,
  Star,
  Compass,
  Shield,
  Zap,
  Users,
  Clock,
  MapPin,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const LandingPage = () => {
  const features = [
    {
      icon: PlusCircle,
      title: "Report Magical Items",
      description:
        "Lost something precious? Found a mysterious treasure? Report it through our enchanted form system and help fellow adventurers.",
      gradient: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Search,
      title: "Mystical Search",
      description:
        "Search through our vast treasury of lost and found items with powerful filters and magical matching algorithms.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description:
        "Receive magical alerts when someone discovers an item matching your description. Never miss a reunion!",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30",
    },
  ]

  const stats = [
    { label: "Items Reunited", value: "247+", icon: Star },
    { label: "Active Seekers", value: "156+", icon: Users },
    { label: "Success Rate", value: "94%", icon: Zap },
    { label: "Avg. Response", value: "2hrs", icon: Clock },
  ]

  const recentItems = [
    {
      name: "Silver Laptop",
      category: "Electronics",
      location: "Library 2nd Floor",
      time: "2 hours ago",
      status: "found",
    },
    {
      name: "Blue Backpack",
      category: "Personal Items",
      location: "Cafeteria",
      time: "5 hours ago",
      status: "lost",
    },
    {
      name: "iPhone 14 Pro",
      category: "Electronics",
      location: "Parking Lot A",
      time: "1 day ago",
      status: "found",
    },
    {
      name: "Gold Watch",
      category: "Accessories",
      location: "Gym",
      time: "2 days ago",
      status: "lost",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">


      {/* Enhanced Hero Section */}
      <section className="relative py-40 md:py-14">
      

        <div className="container mx-auto px-8 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-12"
            >
              {/* Brand Badge */}
              

              {/* Main Heading */}
              <div className="space-y-8">
                <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                  <span className="text-white">Lost Something at</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                    UMT?
                  </span>
                </h1>
                <div className="flex items-center gap-4 mt-8">
                  <Star className="w-7 h-7 text-yellow-400 animate-pulse" />
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                    Welcome to Lost Realm
                  </h2>
                  <Star className="w-7 h-7 text-yellow-400 animate-pulse delay-500" />
                </div>
              </div>

              {/* Description */}
              <p className="text-2xl md:text-3xl text-slate-300 leading-relaxed max-w-2xl">
                The magical portal for University of Management & Technology's lost treasures. Report lost items,
                discover what others have found, and help fellow adventurers reconnect with their precious belongings.
              </p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-8 pt-8"
              >
                <SignInButton mode="modal">
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-12 py-8 text-xl font-semibold rounded-2xl shadow-xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] border-0 w-full sm:w-auto">
                    <PlusCircle className="mr-4 h-7 w-7" />
                    Report an Item
                  </Button>
                </SignInButton>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 hover:bg-white/20 text-white px-12 py-8 text-xl font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto"
                >
                  <Search className="mr-4 h-7 w-7" />
                  Browse Treasures
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
              >
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center space-y-3">
                    <div className="flex items-center justify-center mb-3">
                      <stat.icon className="w-6 h-6 text-purple-400 mr-3" />
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-base text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
                {/* Dashboard Image */}
                <div className="aspect-video rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
                  <img src="/hero.png" alt="Lost Realm Dashboard" className="w-full h-full object-cover" />

                  {/* Overlay gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                  {/* Floating Elements */}
                  <div className="absolute top-6 right-6 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                    Live
                  </div>
                  <div className="absolute bottom-6 left-6 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30 backdrop-blur-sm">
                    Real-time Updates
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-20" />

      {/* Enhanced Features Section */}
      <section className="py-40 relative">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-500/50" />
              <Sparkles className="w-8 h-8 text-purple-400" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent mb-8">
              How the Magic Works
            </h2>
            <p className="text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Discover the enchanted process of reuniting lost treasures with their rightful owners through our mystical
              platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border-white/20 hover:${feature.borderColor} transition-all duration-500 group shadow-2xl hover:shadow-purple-500/20 h-full`}
                >
                  <div className="p-10">
                    <div
                      className={`h-20 w-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/20`}
                    >
                      <feature.icon className={`h-10 w-10 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-6 group-hover:text-purple-200 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-20" />

      {/* Enhanced Recent Items Section */}
      <section className="py-40 relative">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-20 gap-8"
          >
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                Recently Discovered
              </h2>
              <p className="text-2xl text-slate-400">Latest treasures reported by our community of adventurers</p>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-purple-500/20 hover:border-purple-500/40 text-white px-10 py-6 rounded-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              View All Treasures
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border-white/20 hover:border-purple-500/40 transition-all duration-500 group shadow-xl hover:shadow-purple-500/20">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <Badge
                        className={`${
                          item.status === "found"
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
                            : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/30"
                        } font-medium px-4 py-2 text-sm`}
                      >
                        {item.status === "found" ? "Found" : "Lost"}
                      </Badge>
                      <Star className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-200 transition-colors">
                      {item.name}
                    </h3>

                    <div className="space-y-3 text-base text-slate-400">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-400" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-20" />

      {/* Enhanced CTA Section */}
      <section className="py-40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10" />
        <div className="container mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-16 shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-12">
                <Sparkles className="w-10 h-10 text-purple-400" />
                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                  Join the Quest
                </h2>
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>

              <p className="text-2xl text-slate-300 mb-12 leading-relaxed">
                Become part of UMT's magical community. Help fellow adventurers find their lost treasures and discover
                the joy of reuniting precious belongings with their owners.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <SignInButton mode="modal">
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-16 py-8 text-xl font-semibold rounded-2xl shadow-xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] border-0">
                    <Shield className="mr-4 h-7 w-7" />
                    Start Your Journey
                  </Button>
                </SignInButton>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 hover:bg-white/20 text-white px-16 py-8 text-xl font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                >
                  <Compass className="mr-4 h-7 w-7" />
                  Explore Realm
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-32" />
    </main>
  )
}

export default LandingPage
