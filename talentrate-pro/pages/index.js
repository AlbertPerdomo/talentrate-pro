import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, Trash } from 'lucide-react';

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v);

const formatUSD = (v) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v / 4000);

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const add = (p) => {
    if (!selected.find((x) => x.id === p.id)) {
      setSelected([...selected, { ...p, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setSelected(
      selected.map((p) =>
        p.id === id ? { ...p, qty: Number(qty) } : p
      )
    );
  };

  const remove = (id) => {
    setSelected(selected.filter((p) => p.id !== id));
  };

  const total = selected.reduce(
    (acc, p) => acc + p.monthly_rate * p.qty,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex justify-center">
      <div className="w-full max-w-7xl p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">TalentRate</h1>
          <button
            onClick={() => (window.location.href = '/admin')}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            + Crear Perfil
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-center bg-white border rounded-2xl mb-10 shadow-sm">
          <input
            className="flex-1 p-4 outline-none"
            placeholder="Buscar recurso..."
          />
          <div className="px-4">
            <Search />
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {profiles.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.description}</p>

              <p className="mt-3 font-semibold">
                {formatCOP(p.monthly_rate)}
              </p>
              <p className="text-xs text-gray-400">
                {formatUSD(p.monthly_rate)}
              </p>

              <button
                onClick={() => add(p)}
                className="mt-4 w-full bg-black text-white py-2 rounded flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Agregar
              </button>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl mb-4">Cotización</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Recurso</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Valor</th>
                <th className="p-2">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selected.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">
                    <input
                      className="w-16 border p-1 rounded"
                      value={p.qty}
                      onChange={(e) =>
                        updateQty(p.id, e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">{formatCOP(p.monthly_rate)}</td>
                  <td className="p-2">
                    {formatCOP(p.monthly_rate * p.qty)}
                  </td>
                  <td>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-red-500"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-6 text-xl font-bold">
            Total: {formatCOP(total)}
          </div>
        </div>
      </div>
    </div>
  );
}
