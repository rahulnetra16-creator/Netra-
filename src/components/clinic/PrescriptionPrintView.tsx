import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Share2, Eye, Calendar, User, Phone, MapPin } from 'lucide-react';

export const PrescriptionPrintView: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    selectedRxToView, 
    setSelectedRxToView, 
    shopSettings, 
    patients, 
    language,
    openNotificationModal 
  } = useApp();

  if (activeModal !== 'viewRx' || !selectedRxToView) return null;

  const patient = patients.find(p => p.id === selectedRxToView.patientId);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    if (!patient) return;
    const msg = `*${shopSettings.shopName} - Eye Prescription (चश्मे का नंबर)*
Patient: ${selectedRxToView.patientName} (${patient.age}Y/${patient.gender})
Date: ${new Date(selectedRxToView.date).toLocaleDateString()}
---
*Right Eye (OD)*: Sph ${selectedRxToView.rightEye.distSph} | Cyl ${selectedRxToView.rightEye.distCyl} | Axis ${selectedRxToView.rightEye.distAxis} | Near Add: ${selectedRxToView.rightEye.nearAdd}
*Left Eye (OS)*: Sph ${selectedRxToView.leftEye.distSph} | Cyl ${selectedRxToView.leftEye.distCyl} | Axis ${selectedRxToView.leftEye.distAxis} | Near Add: ${selectedRxToView.leftEye.nearAdd}
---
*Lens*: ${selectedRxToView.lensRecommendation.join(', ')}
${selectedRxToView.medicines.length > 0 ? `*Eye Drops*: ${selectedRxToView.medicines.map(m => `${m.name} (${m.timing})`).join(', ')}` : ''}
*Advice*: ${selectedRxToView.advice}
Clinic Ph: ${shopSettings.phone}`;

    openNotificationModal({
      title: 'WhatsApp Rx Slip',
      text: msg,
      recipientPhone: patient.phone,
      type: 'whatsapp'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 text-slate-800 print:border-none print:shadow-none print:m-0 print:w-full">
        
        {/* Screen Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Eye className="w-4 h-4 text-teal-400" />
            <span>{language === 'hi' ? 'नेत्र पर्चा प्रिंट प्रिव्यू' : 'Eye Prescription Slip (Rx)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Rx Slip</span>
            </button>
            <button
              onClick={() => {
                setSelectedRxToView(null);
                setActiveModal(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Document Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Letterhead Header */}
          <div className="border-b-2 border-teal-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2 text-teal-800">
                <Eye className="w-7 h-7" />
                <h1 className="text-2xl font-black tracking-tight">{shopSettings.shopName}</h1>
              </div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mt-0.5">
                Eye Care • Refraction Center • Optical Dispensary
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {shopSettings.address}
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-600">
              <p className="font-bold text-slate-900 text-sm">{shopSettings.doctorName}</p>
              <p className="text-[11px] text-teal-700 font-medium">Optometrist & Ophthalmic Refractionist</p>
              <p className="mt-1 font-mono font-medium flex items-center sm:justify-end gap-1">
                <Phone className="w-3 h-3" /> {shopSettings.phone}
              </p>
              <p className="text-[11px] text-slate-500">Timings: {shopSettings.clinicTimings}</p>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs sm:text-sm grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block text-[11px]">Patient Name:</span>
              <span className="font-bold text-slate-900">{selectedRxToView.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Age / Sex:</span>
              <span className="font-medium text-slate-800">{patient?.age || '-'} Y / {patient?.gender || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Date & Rx No:</span>
              <span className="font-medium text-slate-800">{new Date(selectedRxToView.date).toLocaleDateString()} • {selectedRxToView.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mobile / OPD ID:</span>
              <span className="font-mono font-medium text-slate-800">{patient?.phone || '-'}</span>
            </div>
          </div>

          {/* Refraction Table */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-teal-900">
                Spectacle Prescription (चश्मे का नंबर)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">OD: Right Eye | OS: Left Eye</span>
            </div>

            <table className="w-full text-center text-xs sm:text-sm border-collapse border border-slate-300">
              <thead className="bg-teal-800 text-white text-xs">
                <tr>
                  <th className="border border-teal-700 py-2 px-2 text-left">Eye</th>
                  <th className="border border-teal-700 py-2 px-2">Sph (Spherical)</th>
                  <th className="border border-teal-700 py-2 px-2">Cyl (Cylinder)</th>
                  <th className="border border-teal-700 py-2 px-2">Axis (Degree)</th>
                  <th className="border border-teal-700 py-2 px-2">V/A (Distance)</th>
                  <th className="border border-teal-700 py-2 px-2 bg-teal-900">Near Add</th>
                  <th className="border border-teal-700 py-2 px-2 bg-teal-900">V/A (Near)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-medium font-mono">
                <tr className="hover:bg-slate-50">
                  <td className="border border-slate-300 py-2.5 px-3 text-left font-bold text-teal-800 font-sans">
                    Right Eye (OD)
                  </td>
                  <td className="border border-slate-300 py-2 px-2">{selectedRxToView.rightEye.distSph}</td>
                  <td className="border border-slate-300 py-2 px-2">{selectedRxToView.rightEye.distCyl}</td>
                  <td className="border border-slate-300 py-2 px-2">{selectedRxToView.rightEye.distAxis}</td>
                  <td className="border border-slate-300 py-2 px-2 font-bold">{selectedRxToView.rightEye.distVa}</td>
                  <td className="border border-slate-300 py-2 px-2 bg-teal-50 font-bold text-teal-900">{selectedRxToView.rightEye.nearAdd}</td>
                  <td className="border border-slate-300 py-2 px-2 bg-teal-50 font-bold text-teal-900">{selectedRxToView.rightEye.nearVa}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="border border-slate-300 py-2.5 px-3 text-left font-bold text-teal-800 font-sans">
                    Left Eye (OS)
                  </td>
                  <td className="border border-slate-300 py-2 px-2">{selectedRxToView.leftEye.distSph}</td>
                  <td className="border border-slate-300 py-2 px-2">{selectedRxToView.leftEye.distCyl}</td>
                  <td className="border border-slate-300 py-2 px-2">{selectedRxToView.leftEye.distAxis}</td>
                  <td className="border border-slate-300 py-2 px-2 font-bold">{selectedRxToView.leftEye.distVa}</td>
                  <td className="border border-slate-300 py-2 px-2 bg-teal-50 font-bold text-teal-900">{selectedRxToView.leftEye.nearAdd}</td>
                  <td className="border border-slate-300 py-2 px-2 bg-teal-50 font-bold text-teal-900">{selectedRxToView.leftEye.nearVa}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Lenses Recommended & Frame */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs sm:text-sm">
            <span className="font-bold text-teal-900 block mb-1">Recommended Optical Lenses:</span>
            <div className="flex flex-wrap gap-2">
              {selectedRxToView.lensRecommendation.map((l, i) => (
                <span key={i} className="px-2 py-0.5 bg-white border border-teal-300 rounded text-teal-800 font-medium">
                  ✓ {l}
                </span>
              ))}
              {selectedRxToView.frameType && (
                <span className="px-2 py-0.5 bg-white border border-teal-300 rounded text-slate-700">
                  Frame: {selectedRxToView.frameType}
                </span>
              )}
            </div>
          </div>

          {/* Medicines if any */}
          {selectedRxToView.medicines.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-2">
                Prescribed Eye Drops & Medications (℞)
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {selectedRxToView.medicines.map((m, idx) => (
                  <li key={idx} className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-900">{idx + 1}. {m.name}</span>
                    <span className="text-slate-600 font-mono">{m.dosage} • {m.timing} ({m.duration})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advice & Follow-up */}
          <div className="text-xs sm:text-sm space-y-1">
            <p><span className="font-bold text-slate-800">Advice:</span> {selectedRxToView.advice}</p>
            {selectedRxToView.nextFollowUpDate && (
              <p><span className="font-bold text-teal-700">Next Review:</span> {new Date(selectedRxToView.nextFollowUpDate).toLocaleDateString()}</p>
            )}
          </div>

          {/* Signature Footer */}
          <div className="pt-8 flex justify-between items-end border-t border-slate-200">
            <div className="text-[11px] text-slate-400">
              * Valid for 6 months from date of examination.
              <br />
              In-house optical lens crafting & fitting available at Netra Mobile Center.
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-slate-800 mb-1"></div>
              <p className="text-xs font-bold text-slate-800">{selectedRxToView.doctorName}</p>
              <p className="text-[10px] text-slate-500">Authorized Signature / Stamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
