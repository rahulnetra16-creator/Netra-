import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  TrendingUp, 
  Check, 
  Layers, 
  Tag 
} from 'lucide-react';
import { InventoryItem } from '../../types';

export const InventoryManagement: React.FC = () => {
  const { 
    t, 
    language, 
    inventory, 
    addInventoryItem, 
    updateStock, 
    searchQuery 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('accessories');
  const [brand, setBrand] = useState('');
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [stockQty, setStockQty] = useState<number | ''>(10);
  const [minThreshold, setMinThreshold] = useState<number | ''>(5);
  const [compatibleModels, setCompatibleModels] = useState('');

  const filteredItems = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.compatibleModels && item.compatibleModels.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.stockQty <= item.minThreshold);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !costPrice || !sellingPrice) return;

    addInventoryItem({
      name: name.trim(),
      nameHindi: name.trim(),
      category,
      sku: `SKU-${Date.now().toString().slice(-5)}`,
      brand: brand.trim() || 'General',
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQty: Number(stockQty) || 0,
      minThreshold: Number(minThreshold) || 3,
      unit: 'pcs',
      compatibleModels: compatibleModels.trim(),
    });

    setName('');
    setBrand('');
    setCostPrice('');
    setSellingPrice('');
    setStockQty(10);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Low stock alert banner if items are low */}
      {lowStockItems.length > 0 && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs sm:text-sm text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold">
                {language === 'hi' 
                  ? `कम स्टॉक चेतावनी: ${lowStockItems.length} आइटम न्यूनतम सीमा से कम हैं!`
                  : `Low Stock Warning: ${lowStockItems.length} items are below minimum threshold!`}
              </span>
              <span className="block text-[11px] text-amber-700/80 dark:text-amber-400">
                {lowStockItems.map(i => i.name.split('(')[0]).slice(0, 3).join(', ')}...
              </span>
            </div>
          </div>
          <button
            onClick={() => setCategoryFilter('all')}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold text-xs whitespace-nowrap"
          >
            {language === 'hi' ? 'स्टॉक देखें' : 'View Items'}
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              {t.inventoryTitle}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredItems.length}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:outline-none dark:text-white"
            >
              <option value="all">{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
              <option value="displays_touch">{language === 'hi' ? 'डिस्प्ले व टच फोल्डर' : 'Display & Folders'}</option>
              <option value="accessories">{language === 'hi' ? 'एक्सेसरीज (Neckband, TWS)' : 'Accessories'}</option>
              <option value="cables_chargers">{language === 'hi' ? 'चार्जर व केबल' : 'Chargers & Cables'}</option>
              <option value="tempered_glass_covers">{language === 'hi' ? 'टेम्पर्ड ग्लास व कवर्स' : 'Tempered & Covers'}</option>
              <option value="spare_parts">{language === 'hi' ? 'स्पेयर पार्ट्स व बैटरी' : 'Spare Parts & Battery'}</option>
            </select>

            {/* Add Product Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addProduct}</span>
            </button>
          </div>
        </div>

        {/* Inventory Items Grid / Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 pl-4">Item & SKU</th>
                <th className="p-3">Category & Brand</th>
                <th className="p-3">Cost Price</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">Stock Quantity</th>
                <th className="p-3 pr-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => {
                const isLow = item.stockQty <= item.minThreshold;
                const profitMargin = item.sellingPrice - item.costPrice;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 pl-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                      <span className="font-mono text-[11px] text-slate-400">{item.sku} {item.compatibleModels && `• For: ${item.compatibleModels}`}</span>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.brand}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-medium text-slate-600 dark:text-slate-400">
                      ₹{item.costPrice}
                    </td>

                    <td className="p-3">
                      <span className="font-mono font-bold text-slate-900 dark:text-white block">₹{item.sellingPrice}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Margin: +₹{profitMargin}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-sm font-mono ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.stockQty} {item.unit}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold rounded border border-rose-300">
                            LOW
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateStock(item.id, item.stockQty + 1)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-bold text-xs"
                          title="Add +1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateStock(item.id, item.stockQty + 5)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-bold text-xs"
                          title="Add +5"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => updateStock(item.id, item.stockQty + 10)}
                          className="px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200 rounded font-bold text-xs"
                          title="Add +10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              {t.addProduct}
            </h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Type-C Fast Cable 1M"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InventoryItem['category'])}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    <option value="displays_touch">Displays & Folders</option>
                    <option value="accessories">Accessories</option>
                    <option value="cables_chargers">Cables & Chargers</option>
                    <option value="tempered_glass_covers">Tempered & Covers</option>
                    <option value="spare_parts">Spare Parts & Batteries</option>
                    <option value="smartphones">Smartphones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. boAt / Realme"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Starting Stock Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Low Stock Alert Below</label>
                  <input
                    type="number"
                    min={1}
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
