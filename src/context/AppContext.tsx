import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  ActiveModule, 
  Patient, 
  EyePrescription, 
  RepairJob, 
  InventoryItem, 
  Invoice, 
  ShopSettings, 
  RepairStatus,
  Expense,
  UserSession,
  Customer,
  Reminder
} from '../types';
import { translations } from '../translations';
import { 
  initialShopSettings, 
  initialPatients, 
  initialPrescriptions, 
  initialRepairJobs, 
  initialInventory, 
  initialInvoices,
  initialExpenses,
  initialCustomers,
  initialReminders
} from '../sampleData';

export interface RestoreResult {
  success: boolean;
  error?: string;
  stats?: {
    customers: number;
    repairs: number;
    invoices: number;
    inventory: number;
  };
}

export interface AppContextType {
  // Navigation & Language
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (typeof translations)['en'];
  
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  
  // Universal search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Clinic data & actions
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'registrationDate' | 'tokenNumber' | 'queueStatus'>) => Patient;
  updatePatientStatus: (patientId: string, status: Patient['queueStatus']) => void;
  updatePatientPayment: (patientId: string, status: Patient['paymentStatus'], mode: Patient['paymentMode']) => void;
  
  prescriptions: EyePrescription[];
  addPrescription: (rx: Omit<EyePrescription, 'id' | 'date'>) => EyePrescription;
  
  // Mobile shop & repair data & actions
  repairJobs: RepairJob[];
  addRepairJob: (job: Omit<RepairJob, 'id' | 'receivedDate'>) => RepairJob;
  updateRepairStatus: (jobId: string, status: RepairStatus) => void;
  updateRepairJob: (jobId: string, updates: Partial<RepairJob>) => void;
  
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateStock: (itemId: string, newQty: number) => void;
  
  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => Invoice;

  // Expenses & Daily Kharcha
  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id'>) => Expense;
  deleteExpense: (id: string) => void;

  // CRM Customers & Relationship Management
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'createdDate' | 'lastActiveDate'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  selectedCustomerToView: Customer | null;
  setSelectedCustomerToView: (c: Customer | null) => void;
  getCustomerHistory: (customerPhone: string, customerName?: string) => {
    repairs: RepairJob[];
    invoices: Invoice[];
    totalSpent: number;
    totalRepairs: number;
    totalPurchases: number;
    pendingDue: number;
    totalProfit: number;
  };

  // Reminders & Recurring Push/SMS/WhatsApp Alerts
  reminders: Reminder[];
  addReminder: (rem: Omit<Reminder, 'id' | 'createdAt' | 'status'>) => Reminder;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  sendReminderNow: (id: string) => Promise<{ success: boolean; channel: string }>;
  requestPushNotificationPermission: () => Promise<boolean>;
  
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => void;
  
  // Auth state
  userSession: UserSession;
  loginWithOtp: (phone: string, name?: string, role?: UserSession['role']) => void;
  logout: () => void;

  // Active modals & target items
  activeModal: 'patient' | 'prescription' | 'repair' | 'pos' | 'notification' | 'backup' | 'settings' | 'viewRx' | 'viewInvoice' | 'expense' | 'login' | 'apk' | 'customer' | 'viewCustomer' | 'calculator' | 'scheduleReminder' | null;
  setActiveModal: (m: 'patient' | 'prescription' | 'repair' | 'pos' | 'notification' | 'backup' | 'settings' | 'viewRx' | 'viewInvoice' | 'expense' | 'login' | 'apk' | 'customer' | 'viewCustomer' | 'calculator' | 'scheduleReminder' | null) => void;
  selectedPatientForRx: Patient | null;
  setSelectedPatientForRx: (p: Patient | null) => void;
  selectedRxToView: EyePrescription | null;
  setSelectedRxToView: (rx: EyePrescription | null) => void;
  selectedInvoiceToView: Invoice | null;
  setSelectedInvoiceToView: (inv: Invoice | null) => void;
  notificationMessage: { title: string; text: string; recipientPhone: string; type: 'sms' | 'whatsapp' } | null;
  openNotificationModal: (msg: { title: string; text: string; recipientPhone: string; type: 'sms' | 'whatsapp' }) => void;
  
  // Backup / Reset
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string, mode?: 'replace' | 'merge') => RestoreResult;
  restorePreRestoreSnapshot: () => boolean;
  hasPreRestoreSnapshot: boolean;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'nmc_language',
  PATIENTS: 'nmc_patients',
  PRESCRIPTIONS: 'nmc_prescriptions',
  REPAIRS: 'nmc_repairs',
  INVENTORY: 'nmc_inventory',
  INVOICES: 'nmc_invoices',
  EXPENSES: 'nmc_expenses',
  CUSTOMERS: 'nmc_customers',
  REMINDERS: 'nmc_reminders',
  USER_SESSION: 'nmc_user_session',
  SETTINGS: 'nmc_settings',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'hi';
  });

  const [activeModule, setActiveModule] = useState<ActiveModule>('unified');
  const [searchQuery, setSearchQuery] = useState('');

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [prescriptions, setPrescriptions] = useState<EyePrescription[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  const [repairJobs, setRepairJobs] = useState<RepairJob[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPAIRS);
    return saved ? JSON.parse(saved) : initialRepairJobs;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : initialReminders;
  });

  const [selectedCustomerToView, setSelectedCustomerToView] = useState<Customer | null>(null);

  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return saved ? JSON.parse(saved) : {
      phone: '9699962396',
      name: 'Rahul R Kevat',
      role: 'Owner',
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    };
  });

  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialShopSettings;
  });

  // Modals state
  const [activeModal, setActiveModal] = useState<'patient' | 'prescription' | 'repair' | 'pos' | 'notification' | 'backup' | 'settings' | 'viewRx' | 'viewInvoice' | 'expense' | 'login' | 'apk' | 'customer' | 'viewCustomer' | 'calculator' | 'scheduleReminder' | null>(null);
  const [hasPreRestoreSnapshot, setHasPreRestoreSnapshot] = useState<boolean>(() => typeof window !== 'undefined' && localStorage.getItem('nmc_pre_restore_snapshot') !== null);
  const [selectedPatientForRx, setSelectedPatientForRx] = useState<Patient | null>(null);
  const [selectedRxToView, setSelectedRxToView] = useState<EyePrescription | null>(null);
  const [selectedInvoiceToView, setSelectedInvoiceToView] = useState<Invoice | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<{ title: string; text: string; recipientPhone: string; type: 'sms' | 'whatsapp' } | null>(null);

  // Check PWA shortcut action query params on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      if (action === 'new-repair') {
        setActiveModal('repair');
      } else if (action === 'pos') {
        setActiveModal('pos');
      } else if (action === 'expense') {
        setActiveModal('expense');
      } else if (action === 'apk') {
        setActiveModal('apk');
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(repairJobs));
  }, [repairJobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userSession));
  }, [userSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(shopSettings));
  }, [shopSettings]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language];

  // Clinic actions
  const addPatient = (newPatData: Omit<Patient, 'id' | 'registrationDate' | 'tokenNumber' | 'queueStatus'>): Patient => {
    const nextToken = patients.filter(p => {
      const today = new Date().toDateString();
      return new Date(p.registrationDate).toDateString() === today;
    }).length + 1;

    const newPatient: Patient = {
      ...newPatData,
      id: `NMC-EYE-${1000 + patients.length + 1}`,
      registrationDate: new Date().toISOString(),
      tokenNumber: nextToken,
      queueStatus: 'waiting',
    };

    setPatients(prev => [newPatient, ...prev]);

    // Also record consultation fee bill if paid
    if (newPatient.consultationFee > 0 && newPatient.paymentStatus === 'paid') {
      const newInv: Invoice = {
        id: `INV-${Date.now()}`,
        invoiceNumber: `NMC/CLN/${100 + invoices.length + 1}`,
        date: new Date().toISOString(),
        customerName: newPatient.fullName,
        customerPhone: newPatient.phone,
        moduleType: 'clinic',
        items: [{
          id: `fee-${Date.now()}`,
          title: `Eye OPD Consultation & Refraction (Token #${nextToken})`,
          type: 'clinic_fee',
          quantity: 1,
          unitPrice: newPatient.consultationFee,
          total: newPatient.consultationFee,
        }],
        subtotal: newPatient.consultationFee,
        discount: 0,
        tax: 0,
        grandTotal: newPatient.consultationFee,
        paidAmount: newPatient.consultationFee,
        dueAmount: 0,
        paymentMethod: newPatient.paymentMode === 'pending' ? 'khata' : newPatient.paymentMode,
        status: 'paid',
      };
      setInvoices(prev => [newInv, ...prev]);
    }

    return newPatient;
  };

  const updatePatientStatus = (patientId: string, status: Patient['queueStatus']) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, queueStatus: status } : p));
  };

  const updatePatientPayment = (patientId: string, status: Patient['paymentStatus'], mode: Patient['paymentMode']) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, paymentStatus: status, paymentMode: mode } : p));
  };

  const addPrescription = (rxData: Omit<EyePrescription, 'id' | 'date'>): EyePrescription => {
    const newRx: EyePrescription = {
      ...rxData,
      id: `RX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
    };
    setPrescriptions(prev => [newRx, ...prev]);
    // Set patient queue status to completed
    updatePatientStatus(newRx.patientId, 'completed');
    return newRx;
  };

  // Mobile repair actions
  const addRepairJob = (jobData: Omit<RepairJob, 'id' | 'receivedDate'>): RepairJob => {
    const newJob: RepairJob = {
      ...jobData,
      id: `JOB-2026-${100 + repairJobs.length + 1}`,
      receivedDate: new Date().toISOString(),
    };
    setRepairJobs(prev => [newJob, ...prev]);

    // Auto-sync customer to CRM
    if (jobData.phone) {
      setCustomers(prev => {
        const cleanP = jobData.phone.replace(/\D/g, '').slice(-10);
        const existing = prev.find(c => c.phone.replace(/\D/g, '').slice(-10) === cleanP);
        if (existing) {
          return prev.map(c => c.id === existing.id ? { ...c, lastActiveDate: new Date().toISOString() } : c);
        } else {
          const newCust: Customer = {
            id: `CUST-${1000 + prev.length + 1}`,
            name: jobData.customerName,
            phone: jobData.phone,
            customerType: 'regular',
            notes: `Auto-enrolled via Repair Job #${newJob.id} (${jobData.deviceBrand} ${jobData.deviceModel})`,
            createdDate: new Date().toISOString(),
            lastActiveDate: new Date().toISOString(),
          };
          return [newCust, ...prev];
        }
      });
    }

    return newJob;
  };

  const updateRepairStatus = (jobId: string, status: RepairStatus) => {
    setRepairJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status,
          deliveredDate: status === 'delivered' ? new Date().toISOString() : job.deliveredDate,
        };
      }
      return job;
    }));
  };

  const updateRepairJob = (jobId: string, updates: Partial<RepairJob>) => {
    setRepairJobs(prev => prev.map(job => job.id === jobId ? { ...job, ...updates } : job));
  };

  // Inventory actions
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `INV-PROD-${Date.now().toString().slice(-4)}`,
    };
    setInventory(prev => [newItem, ...prev]);
  };

  const updateStock = (itemId: string, newQty: number) => {
    setInventory(prev => prev.map(item => item.id === itemId ? { ...item, stockQty: Math.max(0, newQty) } : item));
  };

  // Invoice actions
  const addInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>): Invoice => {
    const newInv: Invoice = {
      ...invData,
      id: `INV-${Date.now()}`,
      invoiceNumber: `NMC/${new Date().getFullYear()}/${100 + invoices.length + 1}`,
      date: new Date().toISOString(),
    };
    setInvoices(prev => [newInv, ...prev]);
    
    // Decrement stock for inventory items sold
    newInv.items.forEach(item => {
      if (item.type === 'product') {
        const found = inventory.find(i => i.name === item.title || i.sku === item.id);
        if (found) {
          updateStock(found.id, found.stockQty - item.quantity);
        }
      }
    });

    // Auto-sync customer to CRM
    if (invData.customerPhone) {
      setCustomers(prev => {
        const cleanP = invData.customerPhone.replace(/\D/g, '').slice(-10);
        const existing = prev.find(c => c.phone.replace(/\D/g, '').slice(-10) === cleanP);
        if (existing) {
          return prev.map(c => c.id === existing.id ? { ...c, lastActiveDate: new Date().toISOString() } : c);
        } else {
          const newCust: Customer = {
            id: `CUST-${1000 + prev.length + 1}`,
            name: invData.customerName,
            phone: invData.customerPhone,
            customerType: 'retail',
            notes: `Auto-enrolled via Bill #${newInv.invoiceNumber}`,
            createdDate: new Date().toISOString(),
            lastActiveDate: new Date().toISOString(),
          };
          return [newCust, ...prev];
        }
      });
    }

    return newInv;
  };

  // CRM Customer Management
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdDate' | 'lastActiveDate'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `CUST-${1000 + customers.length + 1}`,
      createdDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates, lastActiveDate: new Date().toISOString() } : c));
    if (selectedCustomerToView && selectedCustomerToView.id === id) {
      setSelectedCustomerToView(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    if (selectedCustomerToView && selectedCustomerToView.id === id) {
      setSelectedCustomerToView(null);
    }
  };

  const getCustomerHistory = (customerPhone: string, customerName?: string) => {
    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    const cleanName = (customerName || '').toLowerCase().trim();

    const repairs = repairJobs.filter(job => {
      const jPhone = (job.phone || '').replace(/\D/g, '');
      const matchPhone = cleanPhone && jPhone.length >= 6 && jPhone.includes(cleanPhone.slice(-10));
      const matchName = cleanName && job.customerName.toLowerCase().trim() === cleanName;
      return matchPhone || matchName;
    });

    const invList = invoices.filter(inv => {
      const iPhone = (inv.customerPhone || '').replace(/\D/g, '');
      const matchPhone = cleanPhone && iPhone.length >= 6 && iPhone.includes(cleanPhone.slice(-10));
      const matchName = cleanName && inv.customerName.toLowerCase().trim() === cleanName;
      return matchPhone || matchName;
    });

    const repairTotal = repairs.reduce((sum, j) => sum + (j.finalCost || j.estimatedCost), 0);
    const invoiceTotal = invList.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalSpent = repairTotal + invoiceTotal;

    const repairDue = repairs.reduce((sum, j) => {
      if (j.status === 'delivered') return sum;
      const billed = j.finalCost || j.estimatedCost;
      return sum + Math.max(0, billed - j.advancePaid);
    }, 0);
    const invoiceDue = invList.reduce((sum, inv) => sum + inv.dueAmount, 0);
    const pendingDue = repairDue + invoiceDue;

    const repairProfit = repairs.reduce((sum, j) => {
      if (j.repairProfit !== undefined) return sum + j.repairProfit;
      const billed = j.finalCost || j.estimatedCost;
      const parts = j.partsCost || 0;
      return sum + (billed - parts);
    }, 0);

    return {
      repairs,
      invoices: invList,
      totalSpent,
      totalRepairs: repairs.length,
      totalPurchases: invList.length,
      pendingDue,
      totalProfit: repairProfit,
    };
  };

  // Reminders & Recurring Push/SMS/WhatsApp Alerts
  const addReminder = (remData: Omit<Reminder, 'id' | 'createdAt' | 'status'>): Reminder => {
    const newRem: Reminder = {
      ...remData,
      id: `REM-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'scheduled',
      sentCount: 0,
    };
    setReminders(prev => [newRem, ...prev]);
    return newRem;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const requestPushNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  };

  const sendReminderNow = async (id: string): Promise<{ success: boolean; channel: string }> => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return { success: false, channel: 'none' };

    const cleanPhone = (reminder.phone || '').replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(reminder.message);

    // If channel includes push
    if (reminder.channel === 'push' || reminder.channel === 'all') {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`🔔 Netra Mobile Center: ${reminder.customerName}`, {
            body: reminder.message,
            icon: '/pwa-192x192.png',
            tag: reminder.id,
          });
        } catch (e) {
          console.warn('Native notification trigger:', e);
        }
      }
    }

    // If channel is whatsapp or all
    if (reminder.channel === 'whatsapp' || reminder.channel === 'all') {
      const waUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone.slice(-10)}&text=${encodedMsg}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } else if (reminder.channel === 'sms') {
      const smsUrl = `sms:${cleanPhone}?body=${encodedMsg}`;
      window.open(smsUrl, '_blank');
    }

    // Calculate next recurrence if recurring
    let nextDate: string | undefined;
    const now = new Date();
    if (reminder.frequency === 'daily') {
      const d = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      nextDate = d.toISOString();
    } else if (reminder.frequency === 'every_3_days') {
      const d = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      nextDate = d.toISOString();
    } else if (reminder.frequency === 'weekly') {
      const d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      nextDate = d.toISOString();
    }

    setReminders(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        return {
          ...r,
          lastSentAt: new Date().toISOString(),
          sentCount: (r.sentCount || 0) + 1,
          scheduledDate: nextDate || r.scheduledDate,
          status: reminder.frequency === 'once' ? 'sent' : 'scheduled',
        };
      })
    );

    return { success: true, channel: reminder.channel };
  };

  // Expenses & Daily Kharcha actions
  const addExpense = (expData: Omit<Expense, 'id'>): Expense => {
    const newExp: Expense = {
      ...expData,
      id: `EXP-${Date.now().toString().slice(-6)}`,
    };
    setExpenses(prev => [newExp, ...prev]);
    return newExp;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Auth actions for Phone 9699962396
  const loginWithOtp = (phoneNum: string, name?: string, role?: UserSession['role']) => {
    const session: UserSession = {
      phone: phoneNum,
      name: name || (phoneNum === '9699962396' ? 'Rahul R Kevat' : 'Staff'),
      role: role || 'Owner',
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    };
    setUserSession(session);
  };

  const logout = () => {
    setUserSession(prev => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const updateShopSettings = (updates: Partial<ShopSettings>) => {
    setShopSettings(prev => ({ ...prev, ...updates }));
  };

  const openNotificationModal = (msg: { title: string; text: string; recipientPhone: string; type: 'sms' | 'whatsapp' }) => {
    setNotificationMessage(msg);
    setActiveModal('notification');
  };

  // Backup & Restore
  const exportDataJSON = () => {
    const data = {
      shopSettings,
      userSession,
      customers,
      reminders,
      patients,
      prescriptions,
      repairJobs,
      inventory,
      invoices,
      expenses,
      exportDate: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Netra_Mobile_Center_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const importDataJSON = (
    jsonString: string,
    mode: 'replace' | 'merge' = 'replace'
  ): RestoreResult => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid or empty JSON file.' };
      }

      const hasRecognizableData = Boolean(
        data.customers || data.repairJobs || data.invoices || data.inventory || data.expenses || data.shopSettings
      );

      if (!hasRecognizableData) {
        return { success: false, error: 'The uploaded file is not a valid Netra Mobile Center backup file.' };
      }

      // Save rollback snapshot
      try {
        const rollbackSnapshot = {
          customers,
          repairJobs,
          invoices,
          inventory,
          expenses,
          reminders,
          shopSettings,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('nmc_pre_restore_snapshot', JSON.stringify(rollbackSnapshot));
        setHasPreRestoreSnapshot(true);
      } catch (err) {
        console.warn('Could not save rollback snapshot', err);
      }

      let restoredCustomersCount = 0;
      let restoredRepairsCount = 0;
      let restoredInvoicesCount = 0;
      let restoredInventoryCount = 0;

      if (mode === 'replace') {
        if (Array.isArray(data.customers)) {
          setCustomers(data.customers);
          restoredCustomersCount = data.customers.length;
        }
        if (Array.isArray(data.reminders)) setReminders(data.reminders);
        if (Array.isArray(data.patients)) setPatients(data.patients);
        if (Array.isArray(data.prescriptions)) setPrescriptions(data.prescriptions);
        if (Array.isArray(data.repairJobs)) {
          setRepairJobs(data.repairJobs);
          restoredRepairsCount = data.repairJobs.length;
        }
        if (Array.isArray(data.inventory)) {
          setInventory(data.inventory);
          restoredInventoryCount = data.inventory.length;
        }
        if (Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
          restoredInvoicesCount = data.invoices.length;
        }
        if (Array.isArray(data.expenses)) setExpenses(data.expenses);
        if (data.shopSettings && typeof data.shopSettings === 'object') setShopSettings(data.shopSettings);
      } else {
        // Merge mode: append without duplicates
        if (Array.isArray(data.customers)) {
          setCustomers(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const newOnes = data.customers.filter((c: any) => !existingIds.has(c.id));
            restoredCustomersCount = newOnes.length;
            return [...prev, ...newOnes];
          });
        }
        if (Array.isArray(data.repairJobs)) {
          setRepairJobs(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const newOnes = data.repairJobs.filter((r: any) => !existingIds.has(r.id));
            restoredRepairsCount = newOnes.length;
            return [...newOnes, ...prev];
          });
        }
        if (Array.isArray(data.invoices)) {
          setInvoices(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            const newOnes = data.invoices.filter((i: any) => !existingIds.has(i.id));
            restoredInvoicesCount = newOnes.length;
            return [...newOnes, ...prev];
          });
        }
        if (Array.isArray(data.inventory)) {
          setInventory(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            const newOnes = data.inventory.filter((i: any) => !existingIds.has(i.id));
            restoredInventoryCount = newOnes.length;
            return [...prev, ...newOnes];
          });
        }
        if (Array.isArray(data.expenses)) {
          setExpenses(prev => {
            const existingIds = new Set(prev.map(e => e.id));
            const newOnes = data.expenses.filter((e: any) => !existingIds.has(e.id));
            return [...newOnes, ...prev];
          });
        }
      }

      return {
        success: true,
        stats: {
          customers: restoredCustomersCount,
          repairs: restoredRepairsCount,
          invoices: restoredInvoicesCount,
          inventory: restoredInventoryCount,
        },
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to parse JSON file.' };
    }
  };

  const restorePreRestoreSnapshot = (): boolean => {
    try {
      const raw = localStorage.getItem('nmc_pre_restore_snapshot');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.customers) setCustomers(data.customers);
      if (data.repairJobs) setRepairJobs(data.repairJobs);
      if (data.invoices) setInvoices(data.invoices);
      if (data.inventory) setInventory(data.inventory);
      if (data.expenses) setExpenses(data.expenses);
      if (data.reminders) setReminders(data.reminders);
      if (data.shopSettings) setShopSettings(data.shopSettings);
      localStorage.removeItem('nmc_pre_restore_snapshot');
      setHasPreRestoreSnapshot(false);
      return true;
    } catch {
      return false;
    }
  };

  const resetToSampleData = () => {
    setCustomers(initialCustomers);
    setReminders(initialReminders);
    setPatients(initialPatients);
    setPrescriptions(initialPrescriptions);
    setRepairJobs(initialRepairJobs);
    setInventory(initialInventory);
    setInvoices(initialInvoices);
    setExpenses(initialExpenses);
    setShopSettings(initialShopSettings);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        activeModule,
        setActiveModule,
        searchQuery,
        setSearchQuery,
        userSession,
        loginWithOtp,
        logout,
        patients,
        addPatient,
        updatePatientStatus,
        updatePatientPayment,
        prescriptions,
        addPrescription,
        repairJobs,
        addRepairJob,
        updateRepairStatus,
        updateRepairJob,
        inventory,
        addInventoryItem,
        updateStock,
        invoices,
        addInvoice,
        expenses,
        addExpense,
        deleteExpense,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        selectedCustomerToView,
        setSelectedCustomerToView,
        getCustomerHistory,
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        sendReminderNow,
        requestPushNotificationPermission,
        shopSettings,
        updateShopSettings,
        activeModal,
        setActiveModal,
        selectedPatientForRx,
        setSelectedPatientForRx,
        selectedRxToView,
        setSelectedRxToView,
        selectedInvoiceToView,
        setSelectedInvoiceToView,
        notificationMessage,
        openNotificationModal,
        exportDataJSON,
        importDataJSON,
        restorePreRestoreSnapshot,
        hasPreRestoreSnapshot,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
