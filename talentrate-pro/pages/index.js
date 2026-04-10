import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, Trash, Pencil, X } from 'lucide-react';

const seniorities = [
  "All",
  "Intern","Trainee","Junior","Junior+",
  "Semi Senior","Senior","Senior+",
  "Lead","Tech Lead","Architect",
  "Principal","Manager","Director"
];

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v);

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const filtered = filter === "All"
    ? profiles
    : profiles.filter(p => p.seniority === filter);

  const add = (p) => {
    if (!selected.find(x => x.id === p.id)) {
      setSelected([...selected, { ...p, qty: 1 }]);
    }
  };

  const total = selected.reduce((acc, p) => acc + p.monthly_rate * p.qty, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-7xl p-10">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold">TalentRate</h1>
          <button onClick={()=>window.location.href='/admin'}
            className="bg-black text-white px-4 py-2 rounded-xl">
            + Crear Perfil
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-4 mb-8">
          <input
            placeholder="Buscar recurso..."
            className="flex-1 border p-3 rounded bg-white text-black"
          />

          <select
            className="border p-3 rounded bg-white"
            value={filter}
            onChange={(e)=>setFilter(e.target.value)}
          >
            {seniorities.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {filtered.slice(0,4).map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow relative">

              <button
                onClick={()=>setEditing(p)}
                className="absolute top-2 right-2 text-gray-400"
              >
                <Pencil size={16}/>
              </button>

              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.seniority}</p>
              <p className="mt-2 font-bold">{formatCOP(p.monthly_rate)}</p>

              <button
                onClick={()=>add(p)}
                className="mt-3 text-sm bg-black text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Plus size={14}/> Agregar
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="bg-white p-6 rounded-xl shadow text-right font-bold">
          Total: {formatCOP(total)}
        </div>

      </div>
    </div>
  );
}
