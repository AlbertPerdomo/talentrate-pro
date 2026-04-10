import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, Trash, Pencil, X } from 'lucide-react';

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v);

const seniorities = ["Junior", "Semi Senior", "Senior"];

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const add = (p) => {
    if (!selected.find(x => x.id === p.id)) {
      setSelected([...selected, { ...p, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setSelected(selected.map(p =>
      p.id === id ? { ...p, qty: Number(qty) } : p
    ));
  };

  const remove = (id) => {
    setSelected(selected.filter(p => p.id !== id));
  };

  const saveEdit = async () => {
    await supabase.from('profiles').update(editing).eq('id', editing.id);
    setEditing(null);
    load();
  };

  const total = selected.reduce((acc, p) => acc + p.monthly_rate * p.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl p-10">

        {/* HEADER */}
        <div className="flex justify-between mb-10">
          <h1 className="text-4xl font-bold">TalentRate</h1>
          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            + Crear Perfil
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-center bg-white border rounded-xl mb-10 shadow-sm">
          <input className="flex-1 p-3 outline-none" placeholder="Buscar recurso..." />
          <Search className="mr-3"/>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {profiles.slice(0,4).map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow relative">

              {/* EDIT */}
              <button
                onClick={() => setEditing(p)}
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
              >
                <Pencil size={16}/>
              </button>

              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.seniority}</p>

              <p className="mt-2 font-bold">{formatCOP(p.monthly_rate)}</p>

              <button
                onClick={() => add(p)}
                className="mt-3 text-sm bg-black text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Plus size={14}/> Agregar
              </button>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Cotización</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>Recurso</th>
                <th>Cantidad</th>
                <th>Valor</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selected.map(p => (
                <tr key={p.id} className="border-b">
                  <td>{p.name}</td>
                  <td>
                    <input
                      className="w-16 border rounded p-1"
                      value={p.qty}
                      onChange={(e)=>updateQty(p.id, e.target.value)}
                    />
                  </td>
                  <td>{formatCOP(p.monthly_rate)}</td>
                  <td>{formatCOP(p.monthly_rate * p.qty)}</td>
                  <td>
                    <button onClick={()=>remove(p.id)}>
                      <Trash size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 font-bold">
            Total: {formatCOP(total)}
          </div>
        </div>

        {/* MODAL EDIT */}
        {editing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">Editar perfil</h2>
                <X onClick={()=>setEditing(null)} className="cursor-pointer"/>
              </div>

              <input
                className="w-full border p-2 mb-2 rounded"
                value={editing.name}
                onChange={(e)=>setEditing({...editing, name:e.target.value})}
              />

              <select
                className="w-full border p-2 mb-2 rounded"
                value={editing.seniority}
                onChange={(e)=>setEditing({...editing, seniority:e.target.value})}
              >
                {seniorities.map(s => <option key={s}>{s}</option>)}
              </select>

              <input
                className="w-full border p-2 mb-4 rounded"
                value={editing.monthly_rate}
                onChange={(e)=>setEditing({...editing, monthly_rate:e.target.value})}
              />

              <button
                onClick={saveEdit}
                className="w-full bg-black text-white py-2 rounded"
              >
                Guardar cambios
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
