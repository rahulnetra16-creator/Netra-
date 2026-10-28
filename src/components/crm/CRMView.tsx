import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerType } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Wrench, 
  ShoppingCart, 
  DollarSign, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  Filter, 
  UserCheck, 
  Edit3, 
  ArrowUpDown, 
  Sparkles,
  Building,
  ShieldCheck,
  Smartphone,
  Bell
} from 'lucide-react';
import { CustomerDetailModal } from './CustomerDetailModal';
import { CustomerModal } from './CustomerModal';
import { ReminderSchedulerModal } from './ReminderSchedulerModal';
import { VoiceSearchInput } from '../common/VoiceSearchInput';

export const CRMView: React.FC = () => {
  const { 
    customers, 
    reminders,
    language, 
    getCustomerHistory, 
    setActiveModal, 
    searchQuery, 
    setSearchQuery,
    selectedCustomerToView,
    setSelectedCustomerToView,
    shopSettings,
    openNotificationModal
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'spent' | 'dues' | 'name'>('recent');
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderPrefillCustomer, setReminderPrefillCustomer] = useState<Customer | null>(null);

  // Filter and search logic
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Global Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qDigits = q.replace(/\D/g, '');

      result = result.filter(c => {
        // Direct customer info match
        const nameMatch = c.name.toLowerCase().includes(q);
        const phoneMatch = c.phone.includes(q) || (qDigits && c.phone.replace(/\D/g, '').includes(qDigits));
        const altPhoneMatch = c.altPhone && c.altPhone.includes(q);
        const areaMatch = (c.cityOrArea || '').toLowerCase().includes(q) || (c.address || '').toLowerCase().includes(q);
        const notesMatch = (c.notes || '').toLowerCase().includes(q);
        const gstinMatch = (c.gstin || '').toLowerCase().includes(q);

        if (nameMatch || phoneMatch || altPhoneMatch || areaMatch || notesMatch || gstinMatch) {
          return true;
        }

        // Search through their repair and purchase history!
        const history = getCustomerHistory(c.phone, c.name);
        const repairMatch = history.repairs.some(r => 
          r.deviceBrand.toLowerCase().includes(q) ||
          r.deviceModel.toLowerCase().includes(q) ||
          (r.imeiOrSerial || '').toLowerCase().includes(q) ||
          r.issueDescription.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );

        const invoiceMatch = history.invoices.some(inv => 
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.items.some(it => it.title.toLowerCase().includes(q))
        );

        return repairMatch || invoiceMatch;
      });
    }

    // Category / Filter tab
    if (filterType === 'dues') {
      result = result.filter(c => {
        const hist = getCustomerHistory(c.phone, c.name);
        return hist.pendingDue > 0;
      });
    } else if (filterType === 'vip') {
      result = result.filter(c => c.customerType === 'vip');
    } else if (filterType === 'wholesaler') {
      result = result.filter(c => c.customerType === 'wholesaler' || c.customerType === 'technician');
    } else if (filterType === 'active_repairs') {
      result = result.filter(c => {
        const hist = getCustomerHistory(c.phone, c.name);
        return hist.repairs.some(r => r.status === 'in_repair' || r.status === 'diagnosing' || r.status === 'waiting_parts');
      });
    }

    // Sort
    result.sort((a, b) => {
      const histA = getCustomerHistory(a.phone, a.name);
      const histB = getCustomerHistory(b.phone, b.name);

      if (sortBy === 'spent') {
        return histB.totalSpent - histA.totalSpent;
      }
      if (sortBy === 'dues') {
        return histB.pendingDue - histA.pendingDue;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // default: recent active
      return new Date(b.lastActiveDate).getTime() - new Date(a.lastActiveDate).getTime();
    });

    return result;
  }, [customers, searchQuery, filterType, sortBy, getCustomerHistory]);

  // Overall CRM Metrics
  const stats = useMemo(() => {
    let totalDues = 0;
    let totalLifetimeRevenue = 0;
    let totalRepairsCount = 0;
    let customersWithDues = 0;

    customers.forEach(c => {
      const h = getCustomerHistory(c.phone, c.name);
      totalLifetimeRevenue += h.totalSpent;
      totalRepairsCount += h.totalRepairs;
      if (h.pendingDue > 0) {
        totalDues += h.pendingDue;
        customersWithDues++;
      }
    });

    return {
      totalCustomers: customers.length,
      totalDues,
      customersWithDues,
      totalLifetimeRevenue,
      totalRepairsCount,
    };
  }, [customers, getCustomerHistory]);

  const handleExportCSV = () => {
    const headers = ['Customer ID', 'Name', 'Phone', 'Alt Phone', 'Category', 'Area', 'Address', 'Total Spent (Rs)', 'Pending Due (Rs)', 'Repairs Count', 'Notes'];
    const rows = customers.map(c => {
      const h = getCustomerHistory(c.phone, c.name);
      return [
        c.id,
        `"${c.name}"`,
        c.phone,
        c.altPhone || '',
        c.customerType,
        `"${c.cityOrArea || ''}"`,
        `"${c.address || ''}"`,
        h.totalSpent,
        h.pendingDue,
        h.totalRepairs,
        `"${c.notes || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Netra_CRM_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenEdit = (customer: Customer) => {
    setCustomerToEdit(customer);
    setActiveModal('customer');
  };

  const handleOpenNew = () => {
    setCustomerToEdit(null);
    setActiveModal('customer');
  };

  const handleSendQuickWhatsApp = (customer: Customer, due: number) => {
    const text = due > 0
      ? `नमस्ते ${customer.name} जी, नेत्र मोबाइल सेंटर से आपका पिछला बकाया ₹${due} बाकी है। कृपया सुविधा अनुसार भुगतान करें। धन्यवाद! संपर्क: राहुल आर. केवट (${shopSettings.phone})`
      : `नमस्ते ${customer.name} जी, नेत्र मोबाइल सेंटर (राहुल आर. केवट) से संपर्क करने हेतु धन्यवाद। किसी भी मोबाइल रिपेयर या एक्सेसरीज़ के लिए संपर्क करें: ${shopSettings.phone}`;

    openNotificationModal({
      title: due > 0 ? (language === 'hi' ? 'बकाया तकादा (WhatsApp)' : 'Payment Reminder') : (language === 'hi' ? 'व्हाट्सएप संदेश' : 'WhatsApp Message'),
      text,
      recipientPhone: customer.phone,
      type: 'whatsapp'
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Top CRM Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 sm:p-6 text-white border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-900/30 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {language === 'hi' ? 'ग्राहक डायरेक्टरी एवं इतिहास (CRM)' : 'Customer Relationship Management (CRM)'}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                  {stats.totalCustomers} {language === 'hi' ? 'ग्राहक' : 'Clients'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'hi'
                  ? 'ग्राहकों के संपर्क विवरण, रिपेयरिंग इतिहास, खरीदारी बिल, पेंडिंग खाता व 1-क्लिक व्हाट्सएप फॉलो-अप।'
                  : 'Manage client contacts, track multi-brand repair history, purchases, pending khata dues, and WhatsApp alerts.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setReminderPrefillCustomer(null);
                setIsReminderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-colors cursor-pointer"
              title="Recurring SMS, WhatsApp & Push Reminders"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'रिमाइंडर व अलर्ट' : 'Alerts & Reminders'}</span>
              {reminders.filter(r => r.status === 'scheduled').length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                  {reminders.filter(r => r.status === 'scheduled').length}
                </span>
              )}
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              title="Export Customer Database as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'hi' ? 'CSV निर्यात' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handleOpenNew}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-cyan-950/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'hi' ? '+ नया ग्राहक जोड़ें' : '+ Add Customer'}</span>
            </button>
          </div>
        </div>

        {/* CRM Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{language === 'hi' ? 'पंजीकृत ग्राहक' : 'Total Customers'}</span>
            <div className="text-lg font-black text-white mt-0.5">{stats.totalCustomers}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{language === 'hi' ? 'कुल रिपेयरिंग जॉब्स' : 'Total Repairs Done'}</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">{stats.totalRepairsCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{language === 'hi' ? 'कुल व्यापार (Revenue)' : 'Total Customer Spend'}</span>
            <div className="text-lg font-black text-cyan-400 mt-0.5">₹{stats.totalLifetimeRevenue.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{language === 'hi' ? 'बकाया खाता (Khata Due)' : 'Pending Khata Dues'}</span>
            <div className="text-lg font-black text-rose-400 mt-0.5">₹{stats.totalDues.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Universal CRM Search Bar with Voice-to-Text */}
          <div className="flex-1">
            <VoiceSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              moduleName="crm"
              placeholder="Speak or type customer name, phone, phone model, IMEI..."
              placeholderHi="ग्राहक का नाम, मोबाइल नं, मॉडल या खराबी बोलें या लिखें..."
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span className="hidden sm:inline text-slate-400">{language === 'hi' ? 'क्रम:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="recent">{language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}</option>
              <option value="spent">{language === 'hi' ? 'सर्वाधिक खरीदारी' : 'Highest Spend'}</option>
              <option value="dues">{language === 'hi' ? 'सर्वाधिक बकाया' : 'Highest Dues'}</option>
              <option value="name">{language === 'hi' ? 'वर्णमाला (A-Z)' : 'Name (A-Z)'}</option>
            </select>
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 text-xs">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी ग्राहक' : 'All Customers', count: customers.length },
            { id: 'dues', label: language === 'hi' ? 'बकाया खाता (Dues)' : 'With Dues', count: stats.customersWithDues, alert: stats.customersWithDues > 0 },
            { id: 'active_repairs', label: language === 'hi' ? 'सक्रिय रिपेयरिंग' : 'Active Repairs' },
            { id: 'vip', label: language === 'hi' ? 'VIP ग्राहक' : 'VIP Clients' },
            { id: 'wholesaler', label: language === 'hi' ? 'थोक व सब-डीलर' : 'Wholesalers / Techs' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{f.label}</span>
              {f.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  f.alert ? 'bg-rose-950 text-rose-300 font-bold' : 'bg-slate-700/80 text-slate-300'
                }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <Users className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">
            {language === 'hi' ? 'कोई ग्राहक नहीं मिला' : 'No Customers Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? (language === 'hi' ? `"${searchQuery}" से मेल खाता कोई रिकॉर्ड नहीं मिला। क्या आप इस नाम से नया ग्राहक जोड़ना चाहते हैं?` : `No records matching "${searchQuery}". Would you like to create one?`)
              : (language === 'hi' ? 'अभी कोई ग्राहक नहीं है। नया ग्राहक जोड़ने के लिए ऊपर बटन दबाएं।' : 'No customers yet. Click above to add a new client.')}
          </p>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया ग्राहक जोड़ें' : 'Add New Customer'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCustomers.map(customer => {
            const history = getCustomerHistory(customer.phone, customer.name);

            return (
              <div
                key={customer.id}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-sm flex flex-col justify-between space-y-3 group"
              >
                {/* Card Top: Avatar, Name, Type, Phone */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-cyan-400 text-sm group-hover:bg-cyan-950/40 group-hover:border-cyan-500/40 transition-colors">
                        {customer.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-cyan-300 transition-colors leading-tight">
                          {customer.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          <a
                            href={`tel:${customer.phone}`}
                            className="text-emerald-400 hover:text-emerald-300 font-mono font-semibold flex items-center gap-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </a>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                            customer.customerType === 'vip'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                              : customer.customerType === 'wholesaler'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {customer.customerType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(customer)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Area / Address */}
                  {customer.cityOrArea && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{customer.cityOrArea}</span>
                    </div>
                  )}

                  {/* Handset History preview snippet */}
                  {history.repairs.length > 0 && (
                    <div className="mb-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-amber-400" />
                          {language === 'hi' ? 'हैंडसेट / रिपेयर' : 'Handset Repaired'}
                        </span>
                        <span>{history.repairs.length} jobs</span>
                      </div>
                      <div className="font-semibold text-white truncate">
                        {history.repairs[0].deviceBrand} {history.repairs[0].deviceModel}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {history.repairs[0].issueDescription}
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Summary Strip */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'कुल खरीदारी' : 'Total Spent'}</span>
                      <strong className="text-slate-200 font-mono text-xs">₹{history.totalSpent.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'बकाया' : 'Due Balance'}</span>
                      <strong className={`font-mono text-xs ${history.pendingDue > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                        {history.pendingDue > 0 ? `₹${history.pendingDue}` : (language === 'hi' ? 'साफ़' : 'Nil')}
                      </strong>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedCustomerToView(customer)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>{language === 'hi' ? 'इतिहास व खाता' : 'View History'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setReminderPrefillCustomer(customer);
                        setIsReminderModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                      title="Schedule recurring pickup/dues reminder"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleSendQuickWhatsApp(customer, history.pendingDue)}
                      className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                      title="WhatsApp message or reminder"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`tel:${customer.phone}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Call customer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Customer Modals */}
      <CustomerModal 
        customerToEdit={customerToEdit} 
        onClose={() => setCustomerToEdit(null)} 
      />

      <CustomerDetailModal
        customer={selectedCustomerToView}
        onClose={() => setSelectedCustomerToView(null)}
        onEdit={(cust) => {
          setSelectedCustomerToView(null);
          handleOpenEdit(cust);
        }}
        onScheduleReminder={(cust) => {
          setReminderPrefillCustomer(cust);
          setIsReminderModalOpen(true);
        }}
      />

      <ReminderSchedulerModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setReminderPrefillCustomer(null);
        }}
        prefillCustomer={reminderPrefillCustomer}
      />

    </div>
  );
};
