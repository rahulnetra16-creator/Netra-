import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, 
  Eye, 
  Search, 
  Users, 
  CheckCircle, 
  Clock, 
  FileText, 
  Printer, 
  Share2, 
  DollarSign, 
  Plus, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Patient } from '../../types';

export const EyeClinicView: React.FC = () => {
  const { 
    t, 
    language, 
    patients, 
    prescriptions, 
    searchQuery, 
    setActiveModal, 
    setSelectedPatientForRx, 
    setSelectedRxToView, 
    updatePatientStatus,
    updatePatientPayment,
    openNotificationModal 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'in_consultation' | 'completed'>('all');

  // Filter patients based on query and queue status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.initialComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.queueStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Today's summary stats
  const today = new Date().toDateString();
  const todayPatients = patients.filter(p => new Date(p.registrationDate).toDateString() === today);
  const waitingCount = todayPatients.filter(p => p.queueStatus === 'waiting').length;
  const inConsultCount = todayPatients.filter(p => p.queueStatus === 'in_consultation').length;
  const completedCount = todayPatients.filter(p => p.queueStatus === 'completed').length;
  const todayOpdRevenue = todayPatients
    .filter(p => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + p.consultationFee, 0);

  const handleOpenRxForPatient = (patient: Patient) => {
    // Check if patient already has an Rx
    const existingRx = prescriptions.find(rx => rx.patientId === patient.id);
    if (existingRx) {
      setSelectedRxToView(existingRx);
      setActiveModal('viewRx');
    } else {
      setSelectedPatientForRx(patient);
      setActiveModal('prescription');
    }
  };

  const handleSendReminder = (patient: Patient) => {
    const msg = language === 'hi'
      ? `नमस्ते ${patient.fullName} जी! नेत्र मोबाइल सेंटर (आई क्लिनिक) से याद दिलाते हैं कि आपकी आँखों की नियमित जाँच का समय हो गया है। कृपया समय निकाल कर पधारें। - राहुल जी`
      : `Dear ${patient.fullName}, gentle reminder from Netra Mobile Center Eye Clinic for your routine eye checkup & spectacle review. Contact: 9876543210.`;

    openNotificationModal({
      title: language === 'hi' ? 'फॉलो-अप चेकअप संदेश' : 'Follow-up Checkup Reminder',
      text: msg,
      recipientPhone: patient.phone,
      type: 'whatsapp'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick OPD Registration Launch */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-emerald-800/50 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {language === 'hi' ? 'नेत्र क्लिनिक प्रबंधन' : 'Eye Clinic Department'}
            </span>
            <span className="text-xs text-slate-400">Dr. K. S. Verma</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            {language === 'hi' ? 'मरीज़ पंजीकरण, चश्मा जाँच व ओपीडी कतार' : 'Patient Registration, Refraction & Queue'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {language === 'hi' 
              ? 'मरीज़ की आँखों की शिकायत दर्ज करें, टोकन जारी करें, चश्मे का नंबर बनाएं और पर्चा प्रिंट करें।'
              : 'Register patients, record chief complaints, manage the waiting lounge, and generate optical prescriptions.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setSelectedPatientForRx(null);
              setActiveModal('patient');
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-5 h-5 text-slate-950" />
            <span>{t.newPatient}</span>
          </button>
          <button
            onClick={() => {
              setSelectedPatientForRx(patients[0] || null);
              setActiveModal('prescription');
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-emerald-300 border border-emerald-700/60 font-bold text-sm transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{t.createPrescription}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'आज कुल मरीज़' : 'Today\'s Patients'}
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {todayPatients.length}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'प्रतीक्षारत (Waiting)' : 'Waiting in Lounge'}
            </span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {waitingCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'चश्मा पर्चे जारी (Rx)' : 'Prescriptions (Rx)'}
            </span>
            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
              {prescriptions.length}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'ओपीडी फीस कमाई' : 'OPD Collections'}
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{todayOpdRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Patient Directory & Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              {t.patientList}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPatients.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'hi' ? 'सभी' : 'All'}
            </button>
            <button
              onClick={() => setStatusFilter('waiting')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'waiting'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {t.waiting} ({waitingCount})
            </button>
            <button
              onClick={() => setStatusFilter('in_consultation')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'in_consultation'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {t.inConsultation} ({inConsultCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {t.completed} ({completedCount})
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 pl-4">Token & ID</th>
                <th className="p-3">{t.fullName}</th>
                <th className="p-3">{t.phone}</th>
                <th className="p-3">{t.initialEyeComplaint}</th>
                <th className="p-3">{t.queueStatus}</th>
                <th className="p-3">{t.consultationFee}</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    {t.noPatientsFound}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const patientRx = prescriptions.find(r => r.patientId === patient.id);
                  return (
                    <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black flex items-center justify-center text-xs">
                            #{patient.tokenNumber}
                          </span>
                          <div>
                            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block">{patient.id}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(patient.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{patient.fullName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {patient.age} Y • {patient.gender} • {patient.address}
                        </span>
                      </td>

                      <td className="p-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {patient.phone}
                        {patient.hasDiabetes && (
                          <span className="block text-[10px] text-rose-500 font-semibold">
                            ⚠️ Sugar/Diabetes
                          </span>
                        )}
                      </td>

                      <td className="p-3 max-w-xs">
                        <p className="line-clamp-2 text-xs font-medium text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                          {patient.initialComplaint}
                        </p>
                      </td>

                      <td className="p-3">
                        <select
                          value={patient.queueStatus}
                          onChange={(e) => updatePatientStatus(patient.id, e.target.value as Patient['queueStatus'])}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            patient.queueStatus === 'waiting'
                              ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                              : patient.queueStatus === 'in_consultation'
                              ? 'bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                              : patient.queueStatus === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          <option value="waiting">{t.waiting}</option>
                          <option value="in_consultation">{t.inConsultation}</option>
                          <option value="completed">{t.completed}</option>
                          <option value="cancelled">{t.cancelled}</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block">₹{patient.consultationFee}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block ${
                          patient.paymentStatus === 'paid' 
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' 
                            : 'text-amber-600 bg-amber-50 dark:bg-amber-950'
                        }`}>
                          {patient.paymentStatus.toUpperCase()} ({patient.paymentMode})
                        </span>
                      </td>

                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Rx Button */}
                          <button
                            onClick={() => handleOpenRxForPatient(patient)}
                            title={patientRx ? 'View Prescription' : 'Create Prescription'}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              patientRx
                                ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800 hover:bg-cyan-200'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{patientRx ? (language === 'hi' ? 'पर्चा देखें' : 'View Rx') : (language === 'hi' ? '+ पर्चा लिखें' : '+ Create Rx')}</span>
                          </button>

                          {/* WhatsApp Reminder */}
                          <button
                            onClick={() => handleSendReminder(patient)}
                            title="Send Follow-up Reminder"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
