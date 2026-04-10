import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const seniorities = [
  "Intern","Trainee","Junior","Junior+",
  "Semi Senior","Senior","Senior+",
  "Lead","Tech Lead","Architect",
  "Principal","Manager","Director"
];

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    seniority: 'Junior',
    monthly_rate: ''
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const save = async () => {
    await supabase.from('profiles').insert([form]);
    setForm({ name: '', seniority: 'Junior', monthly_rate: '' });
    load();
  };

  const remove = async (id) => {
    await supabase.from('profiles').delete().eq('id', id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center text-gray-900">
      <div className="w-full max-w-4xl p-10">

        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Administrar Perfiles</h1>
          <button onClick={() => window.location.href = '/'}>← Volver</button>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="mb-4 font-semibold">Nuevo perfil</h2>

          <input
            placeholder="Recurso (Ej: Desarrollador Odoo)"
            className="w-full border p-2 mb-3 rounded bg-white text-black"
            value={form.name}
            onChange={(e)=>setForm({...form, name:e.target.value})}
          />

          <select
            className="w-full border p-2 mb-3 rounded bg-white text-black"
            value={form.seniority}
            onChange={(e)=>setForm({...form, seniority:e.target.value})}
          >
            {seniorities.map(s => <option key={s}>{s}</option>)}
          </select>

          <input
            placeholder="Valor mensual COP (Ej: 8000000)"
            className="w-full border p-2 mb-4 rounded bg-white text-black"
            value={form.monthly_rate}
            onChange={(e)=>setForm({...form, monthly_rate:e.target.value})}
          />

          <button
            className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
            onClick={save}
          >
            Guardar
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white p-6 rounded-xl shadow">
          {profiles.map(p => (
            <div key={p.id} className="flex justify-between border-b py-3">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">{p.seniority}</p>
              </div>
              <button onClick={()=>remove(p.id)} className="text-red-500">
                Eliminar
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
