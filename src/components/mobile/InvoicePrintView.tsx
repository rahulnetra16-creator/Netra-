import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Printer, 
  Share2, 
  Smartphone, 
  FileText, 
  Phone, 
  MapPin, 
  Check, 
  Copy, 
  Send 
} from 'lucide-react';

export const InvoicePrintView: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    selectedInvoiceToView, 
    setSelectedInvoiceToView, 
    shopSettings, 
    openNotificationModal,
    language 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (activeModal !== 'viewInvoice' || !selectedInvoiceToView) return null;

  const cleanPhone = (selectedInvoiceToView.customerPhone || '').replace(/\D/g, '');

  const formatInvoiceMessage = () => {
    const itemsList = selectedInvoiceToView.items
      .map((it, idx) => `${idx + 1}. *${it.title}* (x${it.quantity}) - ₹${it.total}`)
      .join('\n');

    return `🧾 *${shopSettings.shopName || 'NETRA MOBILE CENTER'} - TAX / RETAIL INVOICE*
━━━━━━━━━━━━━━━━━━━━
*Invoice #:* ${selectedInvoiceToView.invoiceNumber}
*Customer:* ${selectedInvoiceToView.customerName}
*Mobile:* ${selectedInvoiceToView.customerPhone}
*Date:* ${new Date(selectedInvoiceToView.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
━━━━━━━━━━━━━━━━━━━━
*ITEMS PURCHASED:*
${itemsList}
━━━━━━━━━━━━━━━━━━━━
*Subtotal:* ₹${selectedInvoiceToView.subtotal}
${selectedInvoiceToView.discount > 0 ? `*Discount:* -₹${selectedInvoiceToView.discount}\n` : ''}*Grand Total:* ₹${selectedInvoiceToView.grandTotal}
*Amount Paid:* ₹${selectedInvoiceToView.paidAmount}
${selectedInvoiceToView.dueAmount > 0 
  ? `*Balance Due (खाता बाकी):* ₹${selectedInvoiceToView.dueAmount}\n` 
  : '*Status:* FULLY PAID ✓\n'}*Payment Mode:* ${selectedInvoiceToView.paymentMethod.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━
Thank you for shopping with us!
*Shop:* Station Road, Opp. Bus Stand
*Proprietor:* ${shopSettings.ownerName || 'Rahul R Kevat'} (Phone: ${shopSettings.phone || '9699962396'})
*Live App:* ${typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ais-pre-2no3ffb76nphz2s5d5tyuz-988943521245.asia-east1.run.app'}`;
  };

  const handleShareViaWhatsApp = () => {
    const msg = formatInvoiceMessage();

    // Directly open WhatsApp with customer's mobile number pre-filled
    const waUrl = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=91${cleanPhone.slice(-10)}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleCopyInvoice = () => {
    const msg = formatInvoiceMessage();
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 text-slate-800 print:border-none print:shadow-none print:m-0 print:w-full">
        
        {/* Top Action Bar (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-900 text-white print:hidden gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>
              {language === 'hi' ? 'बिलिंग इनवॉइस रसीद' : 'Billing Invoice Receipt'} ({selectedInvoiceToView.invoiceNumber})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary 'Share via WhatsApp' button directly addressing customer */}
            <button
              type="button"
              onClick={handleShareViaWhatsApp}
              title={`Send invoice directly to ${selectedInvoiceToView.customerPhone} on WhatsApp`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/40 cursor-pointer transition-transform hover:scale-105"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Share via WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedInvoiceToView(null);
                setActiveModal(null);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dedicated WhatsApp Quick Dispatch Notice Banner (Screen Only) */}
        <div className="p-3 bg-emerald-50 border-b border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-emerald-950 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block">
                {language === 'hi' ? 'ग्राहक के मोबाइल पर डिजिटल इनवॉइस भेजें:' : 'Send Digital Receipt to Customer:'}
              </span>
              <span className="font-mono text-emerald-800">
                {selectedInvoiceToView.customerName} • {selectedInvoiceToView.customerPhone || 'Phone not provided'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyInvoice}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareViaWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black shadow cursor-pointer transition-transform"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{shareSuccess ? (language === 'hi' ? 'व्हाट्सएप खुल गया!' : 'Opened WhatsApp!') : (language === 'hi' ? 'सीधे व्हाट्सएप भेजें' : 'Send to Customer')}</span>
            </button>
          </div>
        </div>

        {/* Printable Bill Paper */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start gap-4">
            <div className="flex items-start gap-3.5">
              <img
                src="/assets/aistudio/large__1__865785a2.png"
                alt="Mobile Netra Repering"
                className="w-16 h-16 object-contain flex-shrink-0"
              />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">{shopSettings.shopName}</h1>
                <p className="text-xs font-bold text-red-700 uppercase tracking-wide mt-0.5">
                  MOBILE NETRA REPERING • SINCE 2012
                </p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  Proprietor: <span className="font-bold text-slate-900">{shopSettings.ownerName}</span>
                  {shopSettings.email && <span className="text-slate-500 font-normal font-mono ml-2">({shopSettings.email})</span>}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {shopSettings.address}
                </p>
                <p className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  Phone: {shopSettings.phone} • Alt: {shopSettings.altPhone}
                </p>
                {shopSettings.gstNumber && (
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">GSTIN: {shopSettings.gstNumber}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-slate-900 text-white inline-block mb-1">
                TAX / RETAIL INVOICE
              </span>
              <p className="text-xs font-mono font-bold text-slate-800">{selectedInvoiceToView.invoiceNumber}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                Date: {new Date(selectedInvoiceToView.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Billed To / Customer:</span>
              <strong className="text-slate-900 text-sm block">{selectedInvoiceToView.customerName}</strong>
              <span className="font-mono text-slate-600">Mobile: {selectedInvoiceToView.customerPhone}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Payment Status:</span>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase mt-1 ${
                selectedInvoiceToView.status === 'paid' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : selectedInvoiceToView.status === 'partial' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedInvoiceToView.status}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Mode: <span className="font-semibold uppercase">{selectedInvoiceToView.paymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-600 text-left">
                <th className="py-2 w-8">#</th>
                <th className="py-2">Item Description / Service</th>
                <th className="py-2 text-center w-16">Qty</th>
                <th className="py-2 text-right w-24">Rate (₹)</th>
                <th className="py-2 text-right w-24">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {selectedInvoiceToView.items.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="py-2.5 text-slate-400">{index + 1}</td>
                  <td className="py-2.5 font-medium text-slate-900">
                    {item.title}
                    {item.type === 'repair' && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">Repair</span>
                    )}
                  </td>
                  <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                  <td className="py-2.5 text-right font-mono">₹{item.unitPrice}</td>
                  <td className="py-2.5 text-right font-mono font-bold">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-start text-xs">
            <div className="text-slate-500 text-[11px] max-w-xs">
              <p>Thank you for choosing Netra Mobile Center!</p>
              <p className="mt-1">For repair status & warranties, please keep this invoice safe.</p>
            </div>
            <div className="w-56 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-600">
                <span className="font-sans">Subtotal:</span>
                <span>₹{selectedInvoiceToView.subtotal}</span>
              </div>
              {selectedInvoiceToView.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="font-sans">Discount:</span>
                  <span>-₹{selectedInvoiceToView.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-slate-300 pt-1.5 text-slate-950">
                <span className="font-sans">Grand Total:</span>
                <span>₹{selectedInvoiceToView.grandTotal}</span>
              </div>
              <div className="flex justify-between text-slate-700 pt-1">
                <span className="font-sans">Paid Amount:</span>
                <span>₹{selectedInvoiceToView.paidAmount}</span>
              </div>
              {selectedInvoiceToView.dueAmount > 0 && (
                <div className="flex justify-between font-bold text-red-600 border-t border-dashed border-red-300 pt-1">
                  <span className="font-sans">Balance Due:</span>
                  <span>₹{selectedInvoiceToView.dueAmount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-slate-500 text-[11px]">
            <div>
              <p className="font-semibold text-slate-700">Terms & Conditions:</p>
              <p>1. Goods once sold will be exchanged within 7 days in original condition.</p>
              <p>2. 30 days warranty on folder replacement (except physical / liquid damage).</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <p className="text-slate-700 font-semibold">For Netra Mobile Center</p>
              <p className="text-[10px]">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-white print:hidden">
          <div className="flex items-center gap-2 text-slate-300">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'hi' 
                ? `डिजिटल रसीद सीधे ${selectedInvoiceToView.customerName} (${selectedInvoiceToView.customerPhone}) को भेजी जा सकती है।` 
                : `Digital receipt can be shared directly to ${selectedInvoiceToView.customerName} (${selectedInvoiceToView.customerPhone}).`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareViaWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black shadow-lg shadow-emerald-950/40 cursor-pointer transition-transform hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Share via WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रिंट इनवॉइस' : 'Print Invoice'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
