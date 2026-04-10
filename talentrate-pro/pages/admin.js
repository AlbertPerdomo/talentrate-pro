import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    monthly_rate: '',
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const save = async () => {
    if (!form.name) return alert('Nombre requerido');

    await supabase.from('profiles').insert([form]);

    setForm({ name: '', description: '', monthly_rate: '' });
    load();
  };

  const remove = async (id) => {
    await supabase.from('profiles').delete().eq('id', id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl p-10">

        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Administrar Perfiles</h1>
          <button onClick={() => window.location.href = '/'}>← Volver</button>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="mb-4 font-semibold">Nuevo perfil</h2>

          <input
            placeholder="Recurso"
            className="w-full border p-2 mb-2 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Expertise"
            className="w-full border p-2 mb-2 rounded"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            placeholder="Valor COP"
            className="w-full border p-2 mb-4 rounded"
            value={form.monthly_rate}
            onChange={(e) =>
              setForm({ ...form, monthly_rate: e.target.value })
            }
          />

          <button
            onClick={save}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Perfiles</h2>

          {profiles.map((p) => (
            <div
              key={p.id}
              className="flex justify-between border-b py-2"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {p.description}
                </p>
              </div>
              <button
                onClick={() => remove(p.id)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
