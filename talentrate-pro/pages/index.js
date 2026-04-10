import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const seniorities = [
  "Intern","Trainee","Junior","Semi Senior","Senior","Lead"
];

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(v || 0);

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
    setSelected(prev => {
      const exist = prev.find(x => x.id === p.id);
      if (exist) {
        return prev.map(x =>
          x.id === p.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const update = async () => {
    await supabase
      .from('profiles')
      .update({
        name: editing.name,
        seniority: editing.seniority,
        monthly_rate: editing.monthly_rate
      })
      .eq('id', editing.id);

    setEditing(null);
    load();
  };

  const total = selected.reduce(
    (acc, p) => acc + p.monthly_rate * p.qty, 0
  );

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh", padding: 40 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#111" }}>
          TalentRate
        </h1>

        <button
          onClick={() => window.location.href = '/admin'}
          style={{
            background: "#000",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8
          }}
        >
          + Crear Perfil
        </button>
      </div>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
        marginTop: 30
      }}>
        {profiles.slice(0,4).map(p => (
          <div key={p.id} style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "relative"
          }}>

            {/* EDIT */}
            <button
              onClick={() => setEditing(p)}
              style={{
                position: "absolute",
                top: 10,
                right: 10
              }}
            >
              ✏️
            </button>

            <h3 style={{ fontWeight: "bold", color: "#111" }}>
              {p.name}
            </h3>

            <p style={{ color: "#666" }}>{p.seniority}</p>

            <p style={{ marginTop: 10, fontWeight: "bold" }}>
              {formatCOP(p.monthly_rate)}
            </p>

            <button
              onClick={() => add(p)}
              style={{
                marginTop: 10,
                background: "#000",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 6,
                fontSize: 12
              }}
            >
              + Agregar
            </button>
          </div>
        ))}
      </div>

      {/* TABLA */}
      <div style={{
        marginTop: 40,
        background: "#fff",
        padding: 20,
        borderRadius: 12
      }}>
        <h3 style={{ marginBottom: 10 }}>Cotización</h3>

        {selected.map(p => (
          <div key={p.id} style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10
          }}>
            <span>{p.name}</span>

            <input
              type="number"
              value={p.qty}
              onChange={(e)=>{
                const val = Number(e.target.value);
                setSelected(prev =>
                  prev.map(x =>
                    x.id === p.id ? { ...x, qty: val } : x
                  )
                );
              }}
              style={{ width: 60 }}
            />

            <span>{formatCOP(p.monthly_rate)}</span>
            <span>{formatCOP(p.monthly_rate * p.qty)}</span>
          </div>
        ))}

        <h2 style={{ textAlign: "right", marginTop: 20 }}>
          Total: {formatCOP(total)}
        </h2>
      </div>

      {/* MODAL */}
      {editing && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            padding: 30,
            borderRadius: 12,
            width: 300
          }}>

            <h3>Editar</h3>

            <input
              value={editing.name}
              onChange={(e)=>setEditing({...editing, name:e.target.value})}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <select
              value={editing.seniority}
              onChange={(e)=>setEditing({...editing, seniority:e.target.value})}
              style={{ width: "100%", marginBottom: 10 }}
            >
              {seniorities.map(s => <option key={s}>{s}</option>)}
            </select>

            <input
              type="number"
              value={editing.monthly_rate}
              onChange={(e)=>setEditing({...editing, monthly_rate:e.target.value})}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <button onClick={update}
              style={{ background:"#000",color:"#fff",padding:10,width:"100%" }}>
              Guardar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
