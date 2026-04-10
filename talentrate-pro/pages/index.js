import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus } from 'lucide-react';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v);
const formatUSD = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v/4000);

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const add = (p) => {
    if (!selected.find(x => x.id === p.id)) setSelected([...selected, p]);
  };

  const update = (id, value) => {
    setSelected(selected.map(p => p.id === id ? { ...p, monthly_rate: value } : p));
  };

  const total = selected.reduce((acc, p) => acc + Number(p.monthly_rate || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex justify-center">
      <div className="w-full max-w-7xl p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">TalentRate</h1>
          <button className="bg-cyan-500 px-4 py-2 rounded-xl">+ Crear Perfil</button>
        </div>

        {/* SEARCH */}
        <div className="flex items-center bg-white rounded-2xl overflow-hidden mb-10">
          <input className="flex-1 p-4 text-black" placeholder="Buscar recurso..." />
          <div className="px-4"><Search className="text-black"/></div>
        </div>

        {/* TOP 4 CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {profiles.slice(0,4).map(p => (
            <div key={p.id} className="bg-gray-900 p-5 rounded-2xl shadow hover:scale-105 transition">
              <p className="text-xs opacity-60">Recurso</p>
              <h2 className="text-lg font-bold">{p.name}</h2>

              <p className="text-xs opacity-60 mt-2">Expertise</p>
              <p>{p.description}</p>

              <p className="text-xs opacity-60 mt-3">Valor</p>
              <p className="text-cyan-400 font-bold">{formatCOP(p.monthly_rate)}</p>
              <p className="text-xs opacity-60">{formatUSD(p.monthly_rate)}</p>

              <button onClick={()=>add(p)} className="mt-4 w-full bg-cyan-500 py-2 rounded flex items-center justify-center gap-2">
                <Plus size={16}/> Agregar
              </button>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-gray-900 p-6 rounded-2xl">
          <h2 className="text-xl mb-4">Cotización</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Recurso</th>
                  <th className="p-2">Expertise</th>
                  <th className="p-2">Valor COP</th>
                  <th className="p-2">Valor USD</th>
                </tr>
              </thead>
              <tbody>
                {selected.map(p => (
                  <tr key={p.id} className="border-b border-gray-800">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.description}</td>
                    <td className="p-2">
                      <input
                        className="p-2 text-black rounded w-32"
                        value={p.monthly_rate}
                        onChange={(e)=>update(p.id, e.target.value)}
                      />
                    </td>
                    <td className="p-2">{formatUSD(p.monthly_rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-6 text-xl font-bold">
            Total: {formatCOP(total)}
          </div>
        </div>

      </div>
    </div>
  );
}
