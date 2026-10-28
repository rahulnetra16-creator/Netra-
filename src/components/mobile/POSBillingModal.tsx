import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  DollarSign, 
  User, 
  Phone,
  CreditCard 
} from 'lucide-react';
import { BillItem, Invoice } from '../../types';

export const POSBillingModal: React.FC = () => {
  const { 
    t, 
    language, 
    activeModal, 
    setActiveModal, 
    inventory, 
    addInvoice, 
    setSelectedInvoiceToView, 
    shopSettings,
    customers
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', title: '11D Super Tempered Glass', type: 'product', quantity: 1, unitPrice: 99, total: 99 }
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('cash');
  const [paidAmount, setPaidAmount] = useState<number | ''>('');

  if (activeModal !== 'pos') return null;

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = Math.max(0, subtotal - (Number(discount) || 0));
  const effectivePaid = paidAmount === '' ? grandTotal : Number(paidAmount);
  const dueAmount = Math.max(0, grandTotal - effectivePaid);

  const handleAddItemFromInventory = (invId: string) => {
    const item = inventory.find(i => i.id === invId);
    if (!item) return;

    const newItem: BillItem = {
      id: item.id,
      title: item.name,
      type: 'product',
      quantity: 1,
      unitPrice: item.sellingPrice,
      total: item.sellingPrice,
    };
    setItems([...items, newItem]);
  };

  const handleAddCustomItem = () => {
    const newItem: BillItem = {
      id: `custom-${Date.now()}`,
      title: language === 'hi' ? 'मोबाइल रिपेयर सर्विस' : 'Mobile Repair Service',
      type: 'repair',
      quantity: 1,
      unitPrice: 350,
      total: 350,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (index: number, field: keyof BillItem, val: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = val;
    if (field === 'quantity' || field === 'unitPrice') {
      const q = Number(updated[index].quantity) || 1;
      const u = Number(updated[index].unitPrice) || 0;
      updated[index].total = q * u;
    }
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const newInv = addInvoice({
      customerName: customerName.trim() || 'Walk-in Customer (काउंटर ग्राहक)',
      customerPhone: customerPhone.trim() || 'N/A',
      moduleType: 'mobile_shop',
      items,
      subtotal,
      discount: Number(discount) || 0,
      tax: 0,
      grandTotal,
      paidAmount: effectivePaid,
      dueAmount,
      paymentMethod: dueAmount > 0 ? (effectivePaid > 0 ? 'mixed' : 'khata') : paymentMethod,
      status: dueAmount === 0 ? 'paid' : (effectivePaid > 0 ? 'partial' : 'pending'),
    });

    setSelectedInvoiceToView(newInv);
    setActiveModal('viewInvoice');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">{t.posBilling}</h2>
              <p className="text-xs text-cyan-100">{language === 'hi' ? 'दुकान बिक्री, एक्सेसरीज एवं रिपेयर रसीद' : 'Quick Retail & Repair Billing'}</p>
            </div>
          </div>
          <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.customerName}
                </label>
                {customers.length > 0 && (
                  <span className="text-[10px] text-cyan-400 font-medium">CRM Auto-fill</span>
                )}
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  list="pos-customer-list"
                  value={customerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomerName(val);
                    const match = customers.find(c => c.name.toLowerCase() === val.toLowerCase() || c.phone === val);
                    if (match) {
                      setCustomerName(match.name);
                      setCustomerPhone(match.phone);
                    }
                  }}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white"
                />
                <datalist id="pos-customer-list">
                  {customers.map(c => (
                    <option key={c.id} value={c.name}>{c.phone} - {c.cityOrArea || c.customerType}</option>
                  ))}
                </datalist>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.customerPhone}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  list="pos-phone-list"
                  value={customerPhone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomerPhone(val);
                    const match = customers.find(c => c.phone === val || c.phone.endsWith(val));
                    if (match) {
                      setCustomerName(match.name);
                    }
                  }}
                  placeholder="10-digit mobile"
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white font-mono"
                />
                <datalist id="pos-phone-list">
                  {customers.map(c => (
                    <option key={c.id} value={c.phone}>{c.name}</option>
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Quick Add from Inventory */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'स्टॉक से आइटम जोड़ें:' : 'Quick Add from Inventory:'}
              </label>
              <button
                type="button"
                onClick={handleAddCustomItem}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {language === 'hi' ? '+ कस्टम सर्विस / चार्ज' : '+ Custom Service'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {inventory.slice(0, 5).map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddItemFromInventory(item.id)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium cursor-pointer"
                >
                  + {item.name.split('(')[0]} (₹{item.sellingPrice})
                </button>
              ))}
            </div>
          </div>

          {/* Bill Items Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5 pl-3">Item / Service Description</th>
                  <th className="p-2.5 w-20 text-center">Qty</th>
                  <th className="p-2.5 w-28 text-center">Price (₹)</th>
                  <th className="p-2.5 w-28 text-center">Total (₹)</th>
                  <th className="p-2.5 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 pl-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                        className="w-full px-2 py-1 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md dark:text-white"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-16 px-1.5 py-1 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-center dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                        className="w-24 px-1.5 py-1 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-center dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-2 text-center font-bold font-mono text-slate-800 dark:text-white">
                      ₹{item.total}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment & Dues Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.paymentMode}</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Invoice['paymentMethod'])}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white"
                >
                  <option value="cash">Cash (नकद)</option>
                  <option value="upi">UPI / QR (फोनपे/पेटीएम/GPay)</option>
                  <option value="card">Card (कार्ड)</option>
                  <option value="khata">Udhaar / Khata (उधार)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.paidAmount} (₹)</label>
                <input
                  type="number"
                  placeholder={`Default: ₹${grandTotal}`}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm border-l sm:border-slate-200 sm:dark:border-slate-700 sm:pl-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Discount (छूट):</span>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 px-1 py-0.5 text-right bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono"
                />
              </div>
              <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1.5">
                <span>Grand Total:</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">₹{grandTotal}</span>
              </div>
              {dueAmount > 0 && (
                <div className="flex justify-between font-bold text-xs text-red-600 dark:text-red-400 pt-1">
                  <span>Balance Due (बाकी खाता):</span>
                  <span className="font-mono">₹{dueAmount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.generateInvoice}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
