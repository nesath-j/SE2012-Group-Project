// Seed data mirroring Database.sql for flawless fallback & demo preview

export const INITIAL_PRODUCTS = [];

export const INITIAL_DOCTORS = [
  {
    doctorId: 4,
    firstName: 'Janaki',
    lastName: 'Gunarathne',
    specialization: 'Optometry & Contact Lenses',
    licenseNumber: 'OPT-99412',
    bio: 'Senior Clinical Optometrist with 12+ years expertise in complex corneal mapping, multifocal contact fitting, and pediatric vision diagnostics.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    experience: '12 Years'
  },
  {
    doctorId: 5,
    firstName: 'Thilini',
    lastName: 'Jayalath',
    specialization: 'Ophthalmology & Cornea Care',
    licenseNumber: 'OPH-44821',
    bio: 'Consultant Ophthalmologist specializing in refractive surgery assessment, glaucoma early intervention, and anterior segment therapy.',
    avatar: 'https://images.unsplash.com/photo-1594824813515-38b8d003a088?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    experience: '15 Years'
  }
];

export const INITIAL_SCHEDULES = [
  {
    scheduleId: 1,
    doctorId: 4,
    availableDate: '2026-10-15',
    startTime: '09:00:00',
    endTime: '09:45:00',
    isBooked: true
  },
  {
    scheduleId: 2,
    doctorId: 4,
    availableDate: '2026-10-15',
    startTime: '10:00:00',
    endTime: '10:45:00',
    isBooked: false
  },
  {
    scheduleId: 3,
    doctorId: 4,
    availableDate: '2026-10-15',
    startTime: '11:00:00',
    endTime: '11:45:00',
    isBooked: false
  },
  {
    scheduleId: 4,
    doctorId: 5,
    availableDate: '2026-10-16',
    startTime: '14:00:00',
    endTime: '14:45:00',
    isBooked: false
  },
  {
    scheduleId: 5,
    doctorId: 5,
    availableDate: '2026-10-16',
    startTime: '15:00:00',
    endTime: '15:45:00',
    isBooked: false
  },
  {
    scheduleId: 6,
    doctorId: 4,
    availableDate: '2026-10-17',
    startTime: '09:30:00',
    endTime: '10:15:00',
    isBooked: false
  }
];

export const INITIAL_DOCTOR_APPOINTMENTS = [
  {
    doctorAppointmentId: 1,
    memberId: 1,
    doctorId: 4,
    scheduleId: 1,
    appointmentDate: '2026-10-15T09:00:00',
    status: 'SCHEDULED',
    consultationNotes: 'Annual prescription renewal and dry-eye evaluation.'
  }
];

export const INITIAL_EMPLOYEES = [
  {
    employeeId: 6,
    firstName: 'Damini',
    lastName: 'Mendis',
    roleTitle: 'Optical Technician',
    assignedDepartment: 'Lens Fabrication & Repair'
  },
  {
    employeeId: 7,
    firstName: 'Dilini',
    lastName: 'Perera',
    roleTitle: 'Dispensing Optician',
    assignedDepartment: 'Floor Services'
  },
  {
    employeeId: 8,
    firstName: 'Saman',
    lastName: 'De Silva',
    roleTitle: 'General Store Manager',
    assignedDepartment: 'Operations'
  }
];

export const INITIAL_SERVICE_APPOINTMENTS = [
  {
    serviceAppointmentId: 1,
    memberId: 1,
    employeeId: 6,
    serviceType: 'Frame Adjustment',
    appointmentDate: '2026-10-18T10:30:00',
    serviceStatus: 'Scheduled'
  },
  {
    serviceAppointmentId: 2,
    memberId: 2,
    employeeId: 6,
    serviceType: 'Lens Fitting',
    appointmentDate: '2026-10-10T14:00:00',
    serviceStatus: 'Completed'
  },
  {
    serviceAppointmentId: 3,
    memberId: 3,
    employeeId: 7,
    serviceType: 'Repair',
    appointmentDate: '2026-10-19T11:15:00',
    serviceStatus: 'In-Progress'
  }
];

export const INITIAL_LOYALTY_TIERS = [
  {
    tierId: 1,
    tierName: 'Bronze',
    minPoints: 0,
    discountPercentage: 0.00
  },
  {
    tierId: 2,
    tierName: 'Silver',
    minPoints: 500,
    discountPercentage: 5.00
  },
  {
    tierId: 3,
    tierName: 'Gold',
    minPoints: 1500,
    discountPercentage: 10.00
  },
  {
    tierId: 4,
    tierName: 'Platinum',
    minPoints: 3000,
    discountPercentage: 15.00
  }
];

export const INITIAL_COURIERS = [
  {
    courierId: 1,
    companyName: 'DHL Express',
    contactNumber: '077 045 7894',
    serviceType: 'Express Air'
  },
  {
    courierId: 2,
    FedExGround: 'FedEx Ground',
    companyName: 'FedEx Ground',
    contactNumber: '076 784 7054',
    serviceType: 'Standard Ground'
  },
  {
    courierId: 3,
    companyName: 'UPS Worldwide',
    contactNumber: '074 705 7994',
    serviceType: 'Priority Overnight'
  }
];

export const INITIAL_ORDERS = [
  {
    orderId: 1,
    orderDate: '2026-10-08T10:15:00.000Z',
    totalAmount: 165.00,
    discountAmount: 8.25,
    orderStatus: 'Delivered',
    paymentStatus: 'CONFIRMED',
    paymentSlip: 'uploads/slips/sample_slip_1.pdf',
    memberId: 1,
    prescriptionAttached: true,
    loyaltyPointsAwarded: true,
    orderItems: [
      {
        orderItemId: 1,
        quantity: 1,
        unitPrice: 165.00,
        product: { productId: 1, name: 'Ray-Ban Wayfarer Classic', price: 165.00 }
      }
    ],
    delivery: {
      trackingNumber: 'DHL-908124110',
      deliveryStatus: 'Delivered',
      courierName: 'DHL Express',
      dispatchDate: '2026-10-09',
      estimatedDeliveryDate: '2026-10-11'
    }
  },
  {
    orderId: 2,
    orderDate: '2026-10-11T16:40:00.000Z',
    totalAmount: 196.99,
    discountAmount: 19.70,
    orderStatus: 'Shipped',
    paymentStatus: 'CONFIRMED',
    paymentSlip: 'uploads/slips/sample_slip_2.pdf',
    memberId: 1,
    prescriptionAttached: false,
    loyaltyPointsAwarded: true,
    orderItems: [
      {
        orderItemId: 2,
        quantity: 1,
        unitPrice: 182.00,
        product: { productId: 2, name: 'Oakley Holbrook Prizm', price: 182.00 }
      },
      {
        orderItemId: 3,
        quantity: 1,
        unitPrice: 14.99,
        product: { productId: 5, name: 'Anti-Fog Microfiber Cleaning Kit', price: 14.99 }
      }
    ],
    delivery: {
      trackingNumber: 'FEDX-441029411',
      deliveryStatus: 'In Transit',
      courierName: 'FedEx Ground',
      dispatchDate: '2026-10-12',
      estimatedDeliveryDate: '2026-10-15'
    }
  },
  {
    orderId: 3,
    orderDate: '2026-10-13T11:05:00.000Z',
    totalAmount: 85.50,
    discountAmount: 0.00,
    orderStatus: 'Processing',
    paymentStatus: 'TO_BE_CONFIRMED',
    paymentSlip: 'uploads/slips/sample_slip_3.pdf',
    memberId: 1,
    prescriptionAttached: false,
    loyaltyPointsAwarded: false,
    orderItems: [
      {
        orderItemId: 4,
        quantity: 1,
        unitPrice: 85.50,
        product: { productId: 3, name: 'Acuvue Oasys 1-Day (90 pack)', price: 85.50 }
      }
    ]
  }
];
