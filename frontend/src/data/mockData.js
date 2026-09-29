// Realistic initial mock data for VisionExpress
export const INITIAL_PRODUCTS = [
  {
    productId: 1,
    name: "Ray-Ban Aviator Classic",
    category: "Sunglasses",
    price: 165.00,
    stockQuantity: 18,
    description: "Iconic teardrop shape with crystal green G-15 lenses and lightweight gold-toned metal frame.",
    pic: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
  },
  {
    productId: 2,
    name: "Gucci Square Optical Frame",
    category: "Prescription Glasses",
    price: 320.00,
    stockQuantity: 12,
    description: "Premium Italian acetate square silhouette with engraved temple detail and spring hinges.",
    pic: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80"
  },
  {
    productId: 3,
    name: "Tom Ford FT5401 Round",
    category: "Designer Frames",
    price: 380.00,
    stockQuantity: 8,
    description: "Vintage-inspired rounded eyeglasses featuring signature T-logo temples and anti-reflective demo lenses.",
    pic: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80"
  },
  {
    productId: 4,
    name: "Oakley Holbrook Prizm",
    category: "Sunglasses",
    price: 195.00,
    stockQuantity: 25,
    description: "Timeless matte black sport-lifestyle frame with polarized Prizm Sapphire lenses for enhanced contrast.",
    pic: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    productId: 5,
    name: "Prada Monochrome Blue-Light",
    category: "Blue Light Blocking",
    price: 290.00,
    stockQuantity: 14,
    description: "Modern minimalist titanium frame fitted with digital blue-light filtering lenses for screen fatigue relief.",
    pic: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80"
  },
  {
    productId: 6,
    name: "Acuvue Oasys HydraLuxe (30 Pack)",
    category: "Contact Lenses",
    price: 68.50,
    stockQuantity: 45,
    description: "Daily disposable contact lenses designed with tear-infused technology for all-day comfort.",
    pic: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80"
  },
  {
    productId: 7,
    name: "Silhouette Titan Minimal Art",
    category: "Prescription Glasses",
    price: 410.00,
    stockQuantity: 5,
    description: "Ultra-lightweight rimless high-tech titanium chassis offering unprecedented featherlight comfort.",
    pic: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80"
  },
  {
    productId: 8,
    name: "Persol 714 Series Folding",
    category: "Sunglasses",
    price: 350.00,
    stockQuantity: 7,
    description: "The classic Steve McQueen folding sunglasses featuring handmade Italian craftsmanship and patented Meflecto stem.",
    pic: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=600&q=80"
  }
];

export const INITIAL_ORDERS = [
  {
    orderId: 101,
    orderDate: "2026-09-28T14:30:00.000Z",
    totalAmount: 485.00,
    discountAmount: 25.00,
    orderStatus: "Processing",
    prescriptionAttached: true,
    orderItems: [
      { orderItemId: 1, quantity: 1, unitPrice: 320.00, name: "Gucci Square Optical Frame" },
      { orderItemId: 2, quantity: 1, unitPrice: 165.00, name: "Ray-Ban Aviator Classic" }
    ]
  },
  {
    orderId: 102,
    orderDate: "2026-09-29T09:15:00.000Z",
    totalAmount: 195.00,
    discountAmount: 0.00,
    orderStatus: "Dispatched",
    prescriptionAttached: false,
    orderItems: [
      { orderItemId: 3, quantity: 1, unitPrice: 195.00, name: "Oakley Holbrook Prizm" }
    ]
  },
  {
    orderId: 103,
    orderDate: "2026-09-29T11:45:00.000Z",
    totalAmount: 137.00,
    discountAmount: 10.00,
    orderStatus: "Pending",
    prescriptionAttached: true,
    orderItems: [
      { orderItemId: 4, quantity: 2, unitPrice: 68.50, name: "Acuvue Oasys HydraLuxe (30 Pack)" }
    ]
  }
];

export const INITIAL_DELIVERIES = [
  {
    deliveryId: 1,
    orderId: 102,
    courierId: 1,
    trackingNo: "TRK-98B2E4A1",
    deliveryStatus: "IN_TRANSIT",
    dispatchDate: "2026-09-29T10:00:00.000Z",
    estimatedDeliveryDate: "2026-10-02T18:00:00.000Z"
  }
];

export const COURIERS = [
  { courierId: 1, name: "FedEx Optical Express", contact: "+1-800-463-3339", service: "Same-Day Priority" },
  { courierId: 2, name: "DHL Vision World", contact: "+1-800-225-5345", service: "Express Air Tracking" },
  { courierId: 3, name: "VisionCare Direct Courier", contact: "+1-888-555-0199", service: "Standard Fragile Care" }
];
