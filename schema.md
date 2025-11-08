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

## users/{uid}/lists/{listId}
-type: "shopping" | "watch"
-name?: string
-createdAt: timestamp
-branchId?: string


## users/{uid}/lists/{listId}/items/{itemId}
-productId: string
-qty: number
-notes?: string
-targetBranchId?: string  // Optional preferred store for this item
-estimatedPrice?: number  // For budgeting
-purchased?: boolean      // Mark as bought
-purchasedAt?: { branchId: string, price: number, timestamp: timestamp }
// when type: "watch"
-alertSettings?: {
  priceDropPercent?: number,    // Alert when 20% cheaper
  targetPrice?: number,         // Alert when below ₱50
  newStoreAlert?: boolean,      // Alert when available at new store
  saleAlert?: boolean          // Alert when on sale
}

## organizations/{orgId}
-name: string
-aka?: string[]
-country: string
-status: "active" | "inactive"
-website?: string
-createdAt: timestamp

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

## listings/{listingId}
-productId: string
-branchId: string
-chainId?: string
-orgId?: string
-status: "active" | "oos" | "discontinued" | "unknown"
-lastSeenAt?: timestamp
-branchSku?: string
-departmentId?: string
-aisleId?: string
-notes?: string
-priorityStatus: {
  isPriority: boolean,
  priorityScore: number, // 1-100
  bounty: number, // Pesos to earn
  markedAt: timestamp,
  expiresAt: timestamp // Priority expires after X days
}
-lastPriceUpdate: timestamp // For easy querying

## priorityQueue/{queueId}
-listingId: string
-productName: string
-branchName: string
-bounty: number
-createdAt: timestamp
-claimedBy?: string // userId who scanned it
-completedAt?: timestamp

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


## groceryRuns/{runId}
-userId: string
-startedAt: timestamp
-endedAt?: timestamp | null
-branchId?: string
-items: [{ 
  productId: string, 
  qty: number, 
  scannedPrice?: number,     // Price they logged during run
  priceLogId?: string        // Created when run ends
}]


## taxonomy/{taxonomyId}
-name: string
-version: number
-default?: boolean
-createdAt: timestamp

## taxonomy/{taxonomyId}/departments/{departmentId}
-name: string
-slug: string
-sortOrder?: number

## taxonomy/{taxonomyId}/departments/{departmentId}/aisles/{aisleId}
-name: string
-slug: string
-sortOrder?: number

## feedbackReports/{reportId}
-userId?: string
-type: "bug" | "suggestion" | "price_error" | "product_issue" | "general"
-title: string
-description: string
-priority: "low" | "medium" | "high" | "critical"
-status: "open" | "in_progress" | "resolved" | "closed"
-createdAt: timestamp
-resolvedAt?: timestamp
-adminNotes?: string
-metadata?: { version: string, device: string, screenshots?: string[] }

## appContent/{docId}  // FAQs, announcements, etc.
-type: "faq" | "announcement" | "tutorial" | "terms" | "privacy"
-title: string
-content: string
-published: boolean
-createdAt: timestamp
-updatedAt: timestamp
-order?: number

## notifications/{notificationId}
-userId: string
-type: "price_alert" | "new_sale" | "tier_promotion" | "general"
-title: string
-body: string
-read: boolean
-createdAt: timestamp
-data?: { productId?: string, branchId?: string }

## reports/{reportId}  // User reports about products/prices
-reporterId: string
-targetType: "product" | "price_log" | "user"
-targetId: string
-reason: "incorrect_info" | "spam" | "inappropriate" | "duplicate"
-description?: string
-status: "pending" | "reviewed" | "resolved"
-createdAt: timestamp

## moderationQueue/{queueId}
-type: "product_approval" | "user_report" | "price_validation"
-targetId: string
-priority: number
-assignedTo?: string
-createdAt: timestamp

## schemaMeta/{docId}
-version: number
-notes?: string
-createdAt?: timestamp
