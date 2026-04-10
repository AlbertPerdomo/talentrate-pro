import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TRM = 4000;

const seniorities = [
  "Intern","Trainee","Junior","Semi Senior","Senior","Lead","Architect"
];

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(v || 0);

const formatUSD = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v || 0);

export default function Home() {

  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("profiles").select("*");
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

  const remove = (id) => {
    setSelected(prev => prev.filter(x => x.id !== id));
  };

  const total = selected.reduce((acc, p) => acc + p.monthly_rate * p.qty, 0);

  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter ? p.seniority === filter : true)
  );

  return (
    <div>

      {/* ================= HEADER ================= */}
      <div className="container" style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 28 }}>TalentRate</h1>

        <button
          className="btn-primary"
          onClick={() => window.location.href = "/admin"}
        >
          + Crear perfil
        </button>
      </div>

      {/* ================= FILTROS ================= */}
      <div className="container" style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Buscar recurso..."
          onChange={(e)=>setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <select onChange={(e)=>setFilter(e.target.value)}>
          <option value="">Todos</option>
          {seniorities.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* ================= CARDS ================= */}
      <div className="container" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))",
        gap: 16
      }}>
        {filtered.map(p => (
          <div key={p.id} className="card">

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{p.name}</strong>
              <span style={{ fontSize: 12 }}>✏️</span>
            </div>

            <p style={{ fontSize: 12, color: "#777" }}>{p.seniority}</p>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600 }}>
                {formatCOP(p.monthly_rate)}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {formatUSD(p.monthly_rate / TRM)}
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ marginTop: 10 }}
              onClick={() => add(p)}
            >
              + Agregar
            </button>
          </div>
        ))}
      </div>

      {/* ================= COTIZADOR ================= */}
      <div className="container">
        <div className="card">

          <h2 style={{ marginBottom: 10 }}>Cotización</h2>

          {selected.length === 0 && (
            <p style={{ color: "#888" }}>Agrega perfiles para comenzar</p>
          )}

          {selected.map(p => (
            <div key={p.id} className="table-row">

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
              />

              <span>{formatCOP(p.monthly_rate)}</span>
              <span>{formatCOP(p.monthly_rate * p.qty)}</span>

              <button onClick={()=>remove(p.id)} style={{ color: "red" }}>
                ✕
              </button>
            </div>
          ))}

          <h3 style={{ textAlign: "right", marginTop: 15 }}>
            Total: {formatCOP(total)}
          </h3>

        </div>
      </div>

    </div>
  );
}
