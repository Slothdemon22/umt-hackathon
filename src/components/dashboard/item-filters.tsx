"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Package2, CheckCircle } from "lucide-react"
import { ItemStatus } from "@/types/types"

interface ItemFiltersProps {
  activeFilter: ItemStatus | "all"
  onFilterChange: (value: ItemStatus | "all") => void
  counts: {
    all: number
    lost: number
    found: number
    claimed: number
  }
}

export const ItemFilters = ({ activeFilter, onFilterChange, counts }: ItemFiltersProps) => {
  return (
    <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as ItemStatus | "all")}>
      <TabsList className="inline-flex h-14 items-center text-base rounded-2xl bg-black/20 backdrop-blur-xl p-1 border border-white/10 shadow-2xl shadow-purple-500/10">
        <TabsTrigger
          value="all"
          className="relative h-12 rounded-xl px-8 font-medium transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-inner hover:text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          All Items
          <span className="ml-2 text-sm text-slate-400">({counts.all})</span>
        </TabsTrigger>
        
        <TabsTrigger
          value={ItemStatus.LOST}
          className="relative h-12 rounded-xl px-8 font-medium transition-all data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300 data-[state=active]:shadow-inner hover:text-white"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Lost
          <span className="ml-2 text-sm text-slate-400">({counts.lost})</span>
        </TabsTrigger>
        
        <TabsTrigger
          value={ItemStatus.FOUND}
          className="relative h-12 rounded-xl px-8 font-medium transition-all data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:shadow-inner hover:text-white"
        >
          <Package2 className="w-4 h-4 mr-2" />
          Found
          <span className="ml-2 text-sm text-slate-400">({counts.found})</span>
        </TabsTrigger>
        
        <TabsTrigger
          value={ItemStatus.CLAIMED}
          className="relative h-12 rounded-xl px-8 font-medium transition-all data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:shadow-inner hover:text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Claimed
          <span className="ml-2 text-sm text-slate-400">({counts.claimed})</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
} 