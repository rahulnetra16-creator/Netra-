import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Eye, 
  Glasses, 
  Pill, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Printer, 
  MessageSquare 
} from 'lucide-react';
import { EyePrescription } from '../../types';

export const PrescriptionModal: React.FC = () => {
  const { 
    t, 
    language, 
    activeModal, 
    setActiveModal, 
    patients, 
    selectedPatientForRx, 
    setSelectedPatientForRx, 
    addPrescription,
    shopSettings,
    openNotificationModal,
    setSelectedRxToView 
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  
  // Right Eye (OD)
  const [odDistSph, setOdDistSph] = useState('0.00');
  const [odDistCyl, setOdDistCyl] = useState('0.00');
  const [odDistAxis, setOdDistAxis] = useState('');
  const [odDistVa, setOdDistVa] = useState('6/6');
  const [odNearAdd, setOdNearAdd] = useState('+1.50');
  const [odNearVa, setOdNearVa] = useState('N/6');

  // Left Eye (OS)
  const [osDistSph, setOsDistSph] = useState('0.00');
  const [osDistCyl, setOsDistCyl] = useState('0.00');
  const [osDistAxis, setOsDistAxis] = useState('');
  const [osDistVa, setOsDistVa] = useState('6/6');
  const [osNearAdd, setOsNearAdd] = useState('+1.50');
  const [osNearVa, setOsNearVa] = useState('N/6');

  // Lenses & Frame
  const [selectedLenses, setSelectedLenses] = useState<string[]>(['Blue Cut / Computer Glasses', 'Anti-Glare (ARC)']);
  const [frameType, setFrameType] = useState('Full Rim Lightweight');

  // Medicines
  const [medicines, setMedicines] = useState([
    { name: 'Carboxymethylcellulose 0.5% Eye Drops', dosage: '1 Drop', timing: '3 Times daily', duration: '1 Month' }
  ]);

  const [advice, setAdvice] = useState(
    language === 'hi' 
      ? 'चश्मा पढ़ते समय एवं कंप्यूटर/मोबाइल चलाते समय नियमित रूप से पहनें।' 
      : 'Wear spectacles regularly for reading and computer work. Take 20-sec break every 20 mins.'
  );
  const [followUpDate, setFollowUpDate] = useState('');

  useEffect(() => {
    if (selectedPatientForRx) {
      setSelectedPatientId(selectedPatientForRx.id);
    } else if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [selectedPatientForRx, patients]);

  if (activeModal !== 'prescription') return null;

  const currentPatient = patients.find(p => p.id === selectedPatientId);

  const lensOptions = [
    t.singleVision,
    t.bifocal,
    t.progressive,
    t.blueCut,
    t.antiGlare,
    t.photochromatic,
    t.polycarbonate,
  ];

  const toggleLens = (lens: string) => {
    if (selectedLenses.includes(lens)) {
      setSelectedLenses(selectedLenses.filter(l => l !== lens));
    } else {
      setSelectedLenses([...selectedLenses, lens]);
    }
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '1 Drop', timing: '2 Times daily', duration: '15 Days' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index: number, field: string, val: string) => {
    const updated = [...medicines];
    (updated[index] as any)[field] = val;
    setMedicines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    const newRx: EyePrescription = addPrescription({
      patientId: currentPatient.id,
      patientName: currentPatient.fullName,
      rightEye: {
        distSph: odDistSph,
        distCyl: odDistCyl,
        distAxis: odDistAxis ? `${odDistAxis}°` : '-',
        distVa: odDistVa,
        nearAdd: odNearAdd,
        nearVa: odNearVa,
      },
      leftEye: {
        distSph: osDistSph,
        distCyl: osDistCyl,
        distAxis: osDistAxis ? `${osDistAxis}°` : '-',
        distVa: osDistVa,
        nearAdd: osNearAdd,
        nearVa: osNearVa,
      },
      lensRecommendation: selectedLenses,
      frameType,
      medicines: medicines.filter(m => m.name.trim() !== ''),
      advice,
      nextFollowUpDate: followUpDate,
      doctorName: shopSettings.doctorName,
    });

    // Option to view/print
    setSelectedRxToView(newRx);
    setActiveModal('viewRx');
  };

  const handleClose = () => {
    setSelectedPatientForRx(null);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Glasses className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {t.opticalPrescription}
              </h2>
              <p className="text-xs text-teal-100">
                {language === 'hi' ? 'नेत्र जाँच एवं चश्मे का नंबर व आई ड्रॉप पर्चा' : 'Refraction testing chart, lens advice & eye drops'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Select Patient */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'मरीज़ चुनें (Select Patient)' : 'Select Patient'} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-500 focus:outline-none dark:text-white font-medium"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} - {p.phone} ({p.age} Y, {p.gender}) [{p.id}]
                    </option>
                  ))}
                </select>
              </div>
              {currentPatient && (
                <div className="text-xs bg-teal-50 dark:bg-teal-950/60 p-2 rounded-lg border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
                  <span className="font-semibold block">{language === 'hi' ? 'मुख्य शिकायत:' : 'Chief Complaint:'}</span>
                  <span className="line-clamp-1">{currentPatient.initialComplaint}</span>
                </div>
              )}
            </div>
          </div>

          {/* Refraction Table (Eye Power) */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-teal-500/10 dark:bg-teal-950/40 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-teal-600" />
                {language === 'hi' ? 'चश्मे का नंबर चार्ट (Refraction Power)' : 'Refraction Power Chart'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                OD = Right Eye | OS = Left Eye
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-xs border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5 sm:px-3 text-slate-600 dark:text-slate-400">{language === 'hi' ? 'आँख' : 'Eye'}</th>
                    <th className="p-2.5 sm:px-3 text-center">{t.spherical}</th>
                    <th className="p-2.5 sm:px-3 text-center">{t.cylindrical}</th>
                    <th className="p-2.5 sm:px-3 text-center">{t.axis}</th>
                    <th className="p-2.5 sm:px-3 text-center">{t.vaDist}</th>
                    <th className="p-2.5 sm:px-3 text-center bg-teal-50/60 dark:bg-teal-950/30">{t.nearAdd}</th>
                    <th className="p-2.5 sm:px-3 text-center bg-teal-50/60 dark:bg-teal-950/30">{t.vaNear}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {/* Right Eye (OD) */}
                  <tr>
                    <td className="p-2.5 sm:px-3 font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                      {t.rightEyeOD}
                    </td>
                    <td className="p-1 sm:p-2">
                      <input
                        type="text"
                        value={odDistSph}
                        onChange={(e) => setOdDistSph(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-1 sm:p-2">
                      <input
                        type="text"
                        value={odDistCyl}
                        onChange={(e) => setOdDistCyl(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-1 sm:p-2">
                      <input
                        type="text"
                        value={odDistAxis}
                        onChange={(e) => setOdDistAxis(e.target.value)}
                        placeholder="90"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-1 sm:p-2">
                      <select
                        value={odDistVa}
                        onChange={(e) => setOdDistVa(e.target.value)}
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white font-mono"
                      >
                        <option value="6/6">6/6</option>
                        <option value="6/9">6/9</option>
                        <option value="6/12">6/12</option>
                        <option value="6/18">6/18</option>
                        <option value="6/24">6/24</option>
                        <option value="6/36">6/36</option>
                        <option value="6/60">6/60</option>
                      </select>
                    </td>
                    <td className="p-1 sm:p-2 bg-teal-50/40 dark:bg-teal-950/20">
                      <input
                        type="text"
                        value={odNearAdd}
                        onChange={(e) => setOdNearAdd(e.target.value)}
                        placeholder="+1.50"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 rounded-lg font-bold text-teal-800 dark:text-teal-200"
                      />
                    </td>
                    <td className="p-1 sm:p-2 bg-teal-50/40 dark:bg-teal-950/20">
                      <select
                        value={odNearVa}
                        onChange={(e) => setOdNearVa(e.target.value)}
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 rounded-lg dark:text-teal-200 font-mono"
                      >
                        <option value="N/6">N/6</option>
                        <option value="N/8">N/8</option>
                        <option value="N/10">N/10</option>
                        <option value="N/12">N/12</option>
                      </select>
                    </td>
                  </tr>

                  {/* Left Eye (OS) */}
                  <tr>
                    <td className="p-2.5 sm:px-3 font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                      {t.leftEyeOS}
                    </td>
                    <td className="p-1 sm:p-2">
                      <input
                        type="text"
                        value={osDistSph}
                        onChange={(e) => setOsDistSph(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-1 sm:p-2">
                      <input
                        type="text"
                        value={osDistCyl}
                        onChange={(e) => setOsDistCyl(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-1 sm:p-2">
                      <input
                        type="text"
                        value={osDistAxis}
                        onChange={(e) => setOsDistAxis(e.target.value)}
                        placeholder="90"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white font-mono"
                      />
                    </td>
                    <td className="p-1 sm:p-2">
                      <select
                        value={osDistVa}
                        onChange={(e) => setOsDistVa(e.target.value)}
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white font-mono"
                      >
                        <option value="6/6">6/6</option>
                        <option value="6/9">6/9</option>
                        <option value="6/12">6/12</option>
                        <option value="6/18">6/18</option>
                        <option value="6/24">6/24</option>
                        <option value="6/36">6/36</option>
                        <option value="6/60">6/60</option>
                      </select>
                    </td>
                    <td className="p-1 sm:p-2 bg-teal-50/40 dark:bg-teal-950/20">
                      <input
                        type="text"
                        value={osNearAdd}
                        onChange={(e) => setOsNearAdd(e.target.value)}
                        placeholder="+1.50"
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 rounded-lg font-bold text-teal-800 dark:text-teal-200"
                      />
                    </td>
                    <td className="p-1 sm:p-2 bg-teal-50/40 dark:bg-teal-950/20">
                      <select
                        value={osNearVa}
                        onChange={(e) => setOsNearVa(e.target.value)}
                        className="w-full p-1.5 text-center text-xs sm:text-sm bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 rounded-lg dark:text-teal-200 font-mono"
                      >
                        <option value="N/6">N/6</option>
                        <option value="N/8">N/8</option>
                        <option value="N/10">N/10</option>
                        <option value="N/12">N/12</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Lens Recommendation Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Glasses className="w-4 h-4 text-teal-600" />
              {t.lensRecommendation}
            </label>
            <div className="flex flex-wrap gap-2">
              {lensOptions.map((lens, idx) => {
                const isSelected = selectedLenses.includes(lens);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleLens(lens)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && '✓ '} {lens}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Eye Drops & Medicines */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600" />
                {t.medicinesList}
              </label>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addMedicine}
              </button>
            </div>

            <div className="space-y-2">
              {medicines.map((med, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Eye drop / Medicine Name (e.g., Moxifloxacin)"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Dosage (1 Drop)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white text-center"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Timing (3x daily)"
                      value={med.timing}
                      onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white text-center"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white text-center"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(index)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Next Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.doctorAdvice}
              </label>
              <textarea
                rows={2}
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder={t.advicePlaceholder}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.nextFollowUp}
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'पर्चा जारी करें व प्रिंट देखें' : 'Save Prescription & Print Rx'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
