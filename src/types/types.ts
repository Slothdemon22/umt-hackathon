export enum ItemStatus {
  LOST = "lost",
  FOUND = "found",
  CLAIMED = "claimed"
}

export interface UserDetails {
  clerkID: string
  created_at: string
  email: string
  fullName: string
  userRole: string
  isActive: boolean
}

export interface Item {
  id: number
  created_at: string
  clerkID: string
  itemType: string
  itemName: string
  category: string
  description: string
  dateLost: string
  location: string
  imageUrl: string | null
  status: ItemStatus
}

export interface Claim {
  id: number
  created_at: string
  itemID: number
  founderclerkId: string
  claimerClerkId: string
  description: string
  resolvedAt: string | null
  status: "pending" | "approved" | "rejected"
  itemTable: Item
  claimer: UserDetails
  founder: UserDetails
}

export interface User {
  clerkID: string
  created_at: string
  email: string
  fullName: string
  userRole: string
  isActive: boolean
} 