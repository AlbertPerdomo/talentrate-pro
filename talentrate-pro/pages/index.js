import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';

export default function Home() {
  const [tab, setTab] = useState('search');
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ name: '', description: '', skills: '', monthly_rate: '' });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const fuse = new Fuse(profiles, { keys: ['name', 'description', 'skills'] });
  const results = query ? fuse.search(query).map(r => r.item) : profiles;

  const addToList = (profile) => {
    if (!selected.find(p => p.id === profile.id)) {
      setSelected([...selected, profile]);
    }
  };

  const total = selected.reduce((acc, p) => acc + Number(p.monthly_rate || 0), 0);

  const saveProfile = async () => {
    await supabase.from('profiles').insert([{
      name: form.name,
      description: form.description,
      skills: form.skills.split(','),
      monthly_rate: form.monthly_rate
    }]);
    setForm({ name: '', description: '', skills: '', monthly_rate: '' });
    loadProfiles();
    setTab('search');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">TalentRate</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('search')} className={`px-4 py-2 rounded-xl ${tab === 'search' ? 'bg-cyan-500' : 'bg-gray-700'}`}>
          Buscar Perfiles
        </button>
        <button onClick={() => setTab('add')} className={`px-4 py-2 rounded-xl ${tab === 'add' ? 'bg-cyan-500' : 'bg-gray-700'}`}>
          Agregar Perfil
        </button>
      </div>

      {tab === 'search' && (
        <>
          {/* Search */}
          <div className="flex items-center bg-white rounded-xl overflow-hidden mb-6">
            <input
              className="flex-1 p-3 text-black outline-none"
              placeholder="Buscar perfil..."
              onChange={e => setQuery(e.target.value)}
            />
            <div className="px-4">
              <Search className="text-black" />
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {results.map(p => (
              <div key={p.id} className="bg-gray-900 p-4 rounded-2xl shadow">
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-sm opacity-70">{p.description}</p>
                <p className="mt-2 font-bold text-cyan-400">${p.monthly_rate}</p>
                <button onClick={() => addToList(p)} className="mt-3 bg-cyan-500 px-3 py-1 rounded">
                  Agregar
                </button>
              </div>
            ))}
          </div>

          {/* Selected List */}
          <div className="bg-gray-900 p-4 rounded-2xl">
            <h2 className="text-xl mb-4">Perfiles seleccionados</h2>

            {selected.map(p => (
              <div key={p.id} className="flex justify-between border-b border-gray-700 py-2">
                <span>{p.name}</span>
                <span>${p.monthly_rate}</span>
              </div>
            ))}

            <div className="mt-4 text-right font-bold">
              Total: ${total}
            </div>
          </div>
        </>
      )}

      {tab === 'add' && (
        <div className="bg-gray-900 p-6 rounded-2xl max-w-xl">
          <h2 className="text-xl mb-4">Agregar Perfil</h2>

          <input
            placeholder="Nombre"
            className="w-full p-2 mb-3 text-black rounded"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Descripción"
            className="w-full p-2 mb-3 text-black rounded"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Skills (coma)"
            className="w-full p-2 mb-3 text-black rounded"
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
          />

          <input
            placeholder="Tarifa mensual"
            className="w-full p-2 mb-3 text-black rounded"
            value={form.monthly_rate}
            onChange={e => setForm({ ...form, monthly_rate: e.target.value })}
          />

          <button onClick={saveProfile} className="bg-cyan-500 px-4 py-2 rounded">
            Guardar Perfil
          </button>
        </div>
      )}
    </div>
  );
}
