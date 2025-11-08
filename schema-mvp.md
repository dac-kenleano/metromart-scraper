## users/{uid}
-displayName: string
-photoUrl?: string
-createdAt: timestamp
-homeBranchId?: string
-favoriteChains?: string[]
-roles: string[]
-trustScore?: number
-notifTokens?: string[]
-prefs?: { currency?: "PHP", units?: "metric" }
-email?: string
-phoneE164?: string
-emailVerified: boolean
-phoneVerified: boolean
-firstName?: string
-lastName?: string
-age?: number
-occupation?: string
-verifiedAt?: { email?: timestamp, phone?: timestamp }
-tier: "explorer" | "contributor" | "trusted_scout" | "expert_contributor"
-tierMetrics: {
  totalContributions: number,
  accuracyRate: number,
  flaggedReports: number,
  lastTierUpdate: timestamp
}
-badges: string[] // Badge IDs earned
-stats: {
  priceLogsCount: number,
  productsAdded: number,
  consecutiveDays: number,
  weekendContributions: number
}


## chains/{chainId}
-orgId: string
-name: string
-shortName?: string
-format: "convenience_small" | "supermarket_small" | "supermarket" | "hypermarket" | "warehouse_club"
-valueTier?: "value" | "mainstream" | "premium"
-status: "active" | "inactive"


## branches/{branchId}
-orgId: string
-chainId: string
-name: string
-branchCode?: string
-address: { line1?: string, city?: string, region?: string, postcode?: string, country: string }
-geo: { lat: number, lng: number, geohash: string }
-openingHours?: { mon?: string, tue?: string, wed?: string, thu?: string, fri?: string, sat?: string, sun?: string }
-phone?: string | null
-status: "active" | "temp_closed" | "permanently_closed"
-openedOn?: string
-closedOn?: string | null


## products/{productId}
-brand?: string
-name: string
-size?: { qty: number, unit: "g" | "kg" | "ml" | "L" | "pc" }
-barcodes?: string[]
-category?: string
-attributes?: { [k: string]: string | number | boolean }
-status: "active" | "discontinued"
-createdAt: timestamp
-taxonomy?: { taxonomyId: string, departmentId: string, aisleId?: string }
-description?: string
-nutrition?: {
  servingSize: { qty: number, unit: "g" | "ml" | "pieces" | "tbsp" | "cup" }
  servingsPerPackage?: number
  perServing: {
    // Mandatory macronutrients
    "calories"?: number,
    "total_fat"?: number,         // grams
    "saturated_fat"?: number,     // grams
    "trans_fat"?: number,         // grams
    "cholesterol"?: number,       // mg
    "sodium"?: number,            // mg
    "total_carbohydrate"?: number, // grams
    "dietary_fiber"?: number,     // grams
    "total_sugars"?: number,      // grams
    "added_sugars"?: number,      // grams
    "protein"?: number,           // grams
    
    // Mandatory vitamins/minerals (FDA 2016 update)
    "vitamin_d"?: number,         // mcg
    "calcium"?: number,           // mg
    "iron"?: number,              // mg
    "potassium"?: number,         // mg
    
    // Optional but common vitamins
    "vitamin_a"?: number,         // mcg RAE
    "vitamin_c"?: number,         // mg
    "vitamin_e"?: number,         // mg
    "vitamin_k"?: number,         // mcg
    "thiamin"?: number,           // mg
    "riboflavin"?: number,        // mg
    "niacin"?: number,            // mg
    "vitamin_b6"?: number,        // mg
    "folate"?: number,            // mcg DFE
    "vitamin_b12"?: number,       // mcg
    "biotin"?: number,            // mcg
    "pantothenic_acid"?: number,  // mg
    
    // Optional minerals
    "phosphorus"?: number,        // mg
    "iodine"?: number,            // mcg
    "magnesium"?: number,         // mg
    "zinc"?: number,              // mg
    "selenium"?: number,          // mcg
    "copper"?: number,            // mg
    "manganese"?: number,         // mg
    "chromium"?: number,          // mcg
    "molybdenum"?: number,        // mcg
    
    // Additional fats (optional)
    "monounsaturated_fat"?: number, // grams
    "polyunsaturated_fat"?: number, // grams
    "omega_3"?: number,             // grams
    "omega_6"?: number              // grams
  }
}
-images?: [{ url: string, type?: string }]
-overrides?: { name?: string, size?: { qty: number, unit: string }, brand?: string }
-approvalStatus: "pending" | "approved" | "rejected"
-submittedBy?: string (userId)
-reviewedBy?: string (userId)
-reviewedAt?: timestamp
-completionScore: number // 0-100, calculated based on missing fields
-priorityForCompletion: {
  isPriority: boolean,
  bounty: number, // ₱5-10 for product completion
  missingFields: string[], // ["nutrition", "images", "barcode"]
  markedAt: timestamp
}


## priceLogs/{logId}
-productId: string
-branchId: string
-chainId: string
-orgId: string
-price: number
-currency: "PHP"
-size?: { qty: number, unit: string }
-source: "user" | "scrape" | "admin"
-userId?: string
-createdAt: timestamp
-trustTier: 0 | 1 | 2
-flags?: string[]
-saleEndsAt?: timestamp
