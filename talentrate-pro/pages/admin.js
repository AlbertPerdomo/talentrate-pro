import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', monthly_rate: '' });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data || []);
  };

  const save = async () => {
    if (!form.name) return alert('Nombre requerido');

    await supabase.from('profiles').insert([{
      name: form.name,
      description: form.description,
      monthly_rate: form.monthly_rate
    }]);

    setForm({ name: '', description: '', monthly_rate: '' });
    load();
  };

  const remove = async (id) => {
    await supabase.from('profiles').delete().eq('id', id);
    load();
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex justify-center">
      <div className="w-full max-w-5xl p-10">

        <h1 className="text-3xl font-bold mb-8">Administrar Perfiles</h1>

        {/* FORM */}
        <div className="bg-gray-900 p-6 rounded-2xl mb-10">
          <h2 className="mb-4 text-xl">Crear nuevo perfil</h2>

          <input
            placeholder="Recurso (ej: Desarrollador Odoo)"
            className="w-full p-3 mb-3 text-black rounded"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Expertise (ej: Senior, Semi Senior)"
            className="w-full p-3 mb-3 text-black rounded"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Valor mensual COP"
            className="w-full p-3 mb-3 text-black rounded"
            value={form.monthly_rate}
            onChange={e => setForm({ ...form, monthly_rate: e.target.value })}
          />

          <button onClick={save} className="bg-cyan-500 px-4 py-2 rounded">
            Guardar
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-gray-900 p-6 rounded-2xl">
          <h2 className="mb-4 text-xl">Perfiles guardados</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Recurso</th>
                <th className="p-2">Expertise</th>
                <th className="p-2">Valor</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id} className="border-b border-gray-800">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.description}</td>
                  <td className="p-2">${p.monthly_rate}</td>
                  <td className="p-2">
                    <button
                      onClick={() => remove(p.id)}
                      className="bg-red-500 px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
