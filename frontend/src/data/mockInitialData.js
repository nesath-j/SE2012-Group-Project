export const initialDoctors = [
  {
    doctorId: 1,
    userId: 101,
    name: "Dr. Elena Vance",
    specialization: "Ophthalmology & Cornea Specialist",
    licenseNumber: "MED-OPHTH-8821",
    email: "elena.vance@visionexpress.com",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
    experienceYears: 12,
    rating: 4.9
  },
  {
    doctorId: 2,
    userId: 102,
    name: "Dr. Marcus Hayes",
    specialization: "Pediatric Optometry & Vision Therapy",
    licenseNumber: "MED-OPT-5419",
    email: "marcus.hayes@visionexpress.com",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    experienceYears: 9,
    rating: 4.8
  },
  {
    doctorId: 3,
    userId: 103,
    name: "Dr. Sophia Sterling",
    specialization: "Glaucoma & Retinal Disorders",
    licenseNumber: "MED-GLAUC-3392",
    email: "sophia.sterling@visionexpress.com",
    avatar: "https://images.unsplash.com/photo-1594824813589-98a46f25be24?w=300&auto=format&fit=crop&q=80",
    experienceYears: 15,
    rating: 5.0
  },
  {
    doctorId: 4,
    userId: 104,
    name: "Dr. Julian Patel",
    specialization: "Refractive Surgery & Contact Lenses",
    licenseNumber: "MED-REFR-4107",
    email: "julian.patel@visionexpress.com",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
    experienceYears: 8,
    rating: 4.7
  }
];

export const initialSchedules = [
  {
    scheduleId: 1,
    doctorId: 1,
    availableDate: "2026-10-02",
    startTime: "09:00:00",
    endTime: "10:00:00",
    booked: true
  },
  {
    scheduleId: 2,
    doctorId: 1,
    availableDate: "2026-10-02",
    startTime: "10:30:00",
    endTime: "11:30:00",
    booked: false
  },
  {
    scheduleId: 3,
    doctorId: 1,
    availableDate: "2026-10-03",
    startTime: "14:00:00",
    endTime: "15:00:00",
    booked: false
  },
  {
    scheduleId: 4,
    doctorId: 2,
    availableDate: "2026-10-02",
    startTime: "11:00:00",
    endTime: "12:00:00",
    booked: true
  },
  {
    scheduleId: 5,
    doctorId: 2,
    availableDate: "2026-10-03",
    startTime: "09:30:00",
    endTime: "10:30:00",
    booked: false
  },
  {
    scheduleId: 6,
    doctorId: 3,
    availableDate: "2026-10-04",
    startTime: "13:00:00",
    endTime: "14:00:00",
    booked: false
  },
  {
    scheduleId: 7,
    doctorId: 3,
    availableDate: "2026-10-04",
    startTime: "15:30:00",
    endTime: "16:30:00",
    booked: false
  },
  {
    scheduleId: 8,
    doctorId: 4,
    availableDate: "2026-10-05",
    startTime: "10:00:00",
    endTime: "11:00:00",
    booked: false
  }
];

export const initialAppointments = [
  {
    doctorAppointmentId: 101,
    memberId: 501,
    doctorId: 1,
    scheduleId: 1,
    appointmentDate: "2026-10-02T09:00:00",
    status: "SCHEDULED",
    consultationNotes: "Patient reports slight blurring in the right eye under bright lighting. Preliminary refraction recommended."
  },
  {
    doctorAppointmentId: 102,
    memberId: 502,
    doctorId: 2,
    scheduleId: 4,
    appointmentDate: "2026-10-02T11:00:00",
    status: "CONFIRMED",
    consultationNotes: "Annual pediatric eye screening for 7-year old. Screen for amblyopia and astigmatism."
  },
  {
    doctorAppointmentId: 103,
    memberId: 503,
    doctorId: 1,
    scheduleId: 2,
    appointmentDate: "2026-09-25T14:30:00",
    status: "COMPLETED",
    consultationNotes: "Fundus examination normal. Prescribed +1.25 reading glasses with anti-reflective coating."
  }
];

export const initialProducts = [
  {
    id: 1,
    name: "AeroTitanium Aviator RX",
    category: "Prescription Frames",
    price: 249.99,
    stock_quantity: 45,
    description: "Ultra-lightweight Japanese aerospace titanium frames with flexible silicone nose pads and diamond coating.",
    pic: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "LucidOnyx Bold Acetate",
    category: "Eyeglasses",
    price: 189.50,
    stock_quantity: 32,
    description: "Handcrafted Italian acetate eyeglasses with precision spring hinges and anti-blue-light filtering lenses.",
    pic: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Solaris Polarized Chroma",
    category: "Sunglasses",
    price: 219.00,
    stock_quantity: 60,
    description: "UV400 polarized emerald gradient lenses encased in satin-finished gunmetal alloy.",
    pic: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "HydraComfort Daily Soft",
    category: "Contact Lenses",
    price: 65.00,
    stock_quantity: 120,
    description: "Breathable silicone hydrogel daily disposable contact lenses with 78% moisture retention technology.",
    pic: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Nordic Minimalist Hex",
    category: "Prescription Frames",
    price: 220.00,
    stock_quantity: 18,
    description: "Geometric hexagonal rimless architectural frames crafted from memory steel alloy.",
    pic: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "VelvetTortoise Classic",
    category: "Eyeglasses",
    price: 175.00,
    stock_quantity: 28,
    description: "Timeless Havana tortoiseshell finish with warm honey undertones and comfortable keyhole bridge.",
    pic: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80"
  }
];
