export type Language = 'en' | 'hi';

export type ActiveModule = 'unified' | 'repairs' | 'inventory' | 'billing' | 'reports' | 'mobile' | 'clinic' | 'crm';

export type CustomerType = 'retail' | 'regular' | 'vip' | 'wholesaler' | 'technician';

export interface Customer {
  id: string; // e.g., CUST-1001
  name: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address?: string;
  cityOrArea?: string;
  customerType: CustomerType;
  notes?: string;
  gstin?: string;
  createdDate: string;
  lastActiveDate: string;
  totalSpent?: number;
  totalRepairs?: number;
  totalPurchases?: number;
  pendingDue?: number;
}

export interface Patient {
  id: string; // e.g., NMC-EYE-1001
  fullName: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  initialComplaint: string; // e.g., Blurry vision, Watery eyes, Headache, Burning
  bloodPressure?: string;
  hasDiabetes: boolean;
  registrationDate: string; // ISO string
  consultationFee: number;
  paymentStatus: 'paid' | 'pending' | 'free';
  paymentMode: 'cash' | 'upi' | 'card' | 'pending';
  tokenNumber: number;
  queueStatus: 'waiting' | 'in_consultation' | 'completed' | 'cancelled';
  notes?: string;
}

export interface EyePrescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  // Right Eye (OD - Oculus Dexter)
  rightEye: {
    distSph: string;
    distCyl: string;
    distAxis: string;
    distVa: string;
    nearAdd: string;
    nearVa: string;
  };
  // Left Eye (OS - Oculus Sinister)
  leftEye: {
    distSph: string;
    distCyl: string;
    distAxis: string;
    distVa: string;
    nearAdd: string;
    nearVa: string;
  };
  lensRecommendation: string[]; // e.g., 'Blue Cut', 'Anti-Glare', 'Progressive', 'Bifocal'
  frameType?: string; // e.g., 'Full Rim', 'Rimless', 'Supra'
  medicines: {
    name: string;
    dosage: string;
    timing: string;
    duration: string;
  }[];
  advice: string;
  nextFollowUpDate?: string;
  doctorName: string;
}

export type RepairStatus = 
  | 'received' 
  | 'diagnosing' 
  | 'in_repair' 
  | 'waiting_parts' 
  | 'ready_for_pickup' 
  | 'delivered' 
  | 'cancelled';

export interface RepairJob {
  id: string; // e.g., JOB-2026-089
  customerName: string;
  phone: string;
  deviceBrand: string; // Samsung, Vivo, Xiaomi, iPhone, Oppo, Realme, etc.
  deviceModel: string;
  imeiOrSerial?: string;
  passcodePattern?: string;
  issueDescription: string; // e.g., Screen broken, Charging issue, Water damage
  conditionNotes?: string; // Scratches, back cracked
  estimatedCost: number;
  advancePaid: number;
  finalCost?: number;
  partsCost?: number; // Wholesale spare parts / display folder cost
  repairProfit?: number; // Customer price minus parts cost
  status: RepairStatus;
  receivedDate: string;
  promisedDate?: string;
  deliveredDate?: string;
  technicianName: string;
  paymentMode: 'cash' | 'upi' | 'khata';
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameHindi: string;
  category: 'smartphones' | 'displays_touch' | 'accessories' | 'cables_chargers' | 'spare_parts' | 'tempered_glass_covers';
  sku: string;
  brand: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  minThreshold: number; // Low stock alert threshold
  unit: string; // pcs, set, pkt
  compatibleModels?: string;
}

export interface BillItem {
  id: string;
  title: string;
  type: 'product' | 'repair' | 'clinic_fee' | 'spectacles';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string; // e.g., INV-2026-045
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  moduleType: 'clinic' | 'mobile_shop' | 'repair';
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'mixed' | 'khata';
  status: 'paid' | 'partial' | 'pending';
}

export interface Expense {
  id: string;
  title: string;
  titleHindi?: string;
  category: 'tea_snacks' | 'rent' | 'electricity' | 'mobile_parts_purchase' | 'clinic_supplies' | 'staff_salary' | 'transport' | 'other';
  amount: number;
  date: string; // ISO string
  moduleType: 'clinic' | 'mobile_shop' | 'common';
  paidVia: 'cash' | 'upi';
  paidTo: string;
  notes?: string;
}

export interface UserSession {
  phone: string;
  name: string;
  role: 'Owner' | 'Technician' | 'Doctor';
  isLoggedIn: boolean;
  loginTime?: string;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  ownerName: string;
  doctorName: string;
  phone: string;
  altPhone: string;
  email?: string;
  address: string;
  gstNumber?: string;
  clinicTimings: string;
  shopTimings: string;
}

export type ReminderType = 'pickup_ready' | 'followup_warranty' | 'khata_due' | 'custom';
export type ReminderChannel = 'whatsapp' | 'sms' | 'push' | 'all';
export type ReminderFrequency = 'once' | 'daily' | 'every_3_days' | 'weekly';

export interface Reminder {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  type: ReminderType;
  channel: ReminderChannel;
  frequency: ReminderFrequency;
  scheduledDate: string;
  message: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  deviceInfo?: string;
  createdAt: string;
  lastSentAt?: string;
  sentCount?: number;
}

