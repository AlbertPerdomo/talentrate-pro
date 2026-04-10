import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Fuse from 'fuse.js';
import { Search, Plus } from 'lucide-react';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v);
const formatUSD = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v/4000);

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const fuse = new Fuse(profiles, { keys: ['name', 'description', 'skills'] });
  const results = query ? fuse.search(query).map(r => r.item) : profiles;

  const addToList = (p) => {
    if (!selected.find(x => x.id === p.id)) {
      setSelected([...selected, p]);
    }
  };

  const updatePrice = (id, value) => {
    setSelected(selected.map(p => p.id === id ? { ...p, monthly_rate: value } : p));
  };

  const total = selected.reduce((acc, p) => acc + Number(p.monthly_rate || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex justify-center">
      <div className="w-full max-w-6xl p-8">

        <h1 className="text-4xl font-bold mb-8 text-center">TalentRate</h1>

        {/* Search */}
        <div className="flex items-center bg-white rounded-2xl overflow-hidden mb-8 shadow">
          <input
            className="flex-1 p-4 text-black outline-none"
            placeholder="Buscar perfiles (ej: Odoo, SAP, DevOps...)"
            onChange={e => setQuery(e.target.value)}
          />
          <div className="px-4">
            <Search className="text-black" />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {results.map(p => (
            <div key={p.id} className="bg-gray-900 p-5 rounded-2xl shadow hover:scale-105 transition">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm opacity-70 mb-2">{p.description}</p>
              <p className="text-cyan-400 font-bold">{formatCOP(p.monthly_rate)}</p>
              <p className="text-xs opacity-60">{formatUSD(p.monthly_rate)}</p>
              <button onClick={() => addToList(p)} className="mt-3 w-full bg-cyan-500 py-2 rounded flex items-center justify-center gap-2">
                <Plus size={16}/> Agregar
              </button>
            </div>
          ))}
        </div>

        {/* Selected */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h2 className="text-xl mb-4">Cotización</h2>

          {selected.length === 0 && <p className="opacity-60">Agrega perfiles para cotizar</p>}

          {selected.map(p => (
            <div key={p.id} className="flex justify-between items-center mb-3">
              <div>
                <p>{p.name}</p>
                <p className="text-xs opacity-60">{formatUSD(p.monthly_rate)}</p>
              </div>
              <input
                className="w-32 p-2 text-black rounded"
                value={p.monthly_rate}
                onChange={(e)=>updatePrice(p.id, e.target.value)}
              />
            </div>
          ))}

          <div className="mt-6 text-right text-xl font-bold">
            Total: {formatCOP(total)}
          </div>
        </div>

      </div>
    </div>
  );
}
