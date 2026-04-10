import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TRM = 4000;

const seniorities = [
  "Intern","Trainee","Junior","Semi Senior","Senior","Lead","Architect"
];

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP"
  }).format(v || 0);

const formatUSD = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(v || 0);

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);

  const [filter, setFilter] = useState("");
  const [seniorityFilter, setSeniorityFilter] = useState("");

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

  const update = async () => {
    await supabase.from("profiles")
      .update({
        name: editing.name,
        seniority: editing.seniority,
        monthly_rate: editing.monthly_rate
      })
      .eq("id", editing.id);

    setEditing(null);
    load();
  };

  const total = selected.reduce(
    (acc, p) => acc + p.monthly_rate * p.qty, 0
  );

  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) &&
    (seniorityFilter ? p.seniority === seniorityFilter : true)
  );

  return (
    <div style={{ background: "#f6f7f9", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 30 }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>TalentRate</h1>

          <button
            onClick={() => window.location.href = "/admin"}
            style={{
              background: "#000",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 14
            }}
          >
            + Crear perfil
          </button>
        </div>

        {/* FILTROS */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <input
            placeholder="Buscar recurso..."
            onChange={(e) => setFilter(e.target.value)}
            style={{ flex: 1 }}
          />

          <select
            onChange={(e) => setSeniorityFilter(e.target.value)}
            style={{ width: 180 }}
          >
            <option value="">Todos</option>
            {seniorities.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
          gap: 16,
          marginTop: 25
        }}>
          {filtered.slice(0, 6).map(p => (
            <div key={p.id} style={{
              background: "#fff",
              padding: 16,
              borderRadius: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              position: "relative"
            }}>

              <button
                onClick={() => setEditing(p)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  fontSize: 12
                }}
              >
                ✏️
              </button>

              <h3 style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</h3>
              <p style={{ fontSize: 12, color: "#666" }}>{p.seniority}</p>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 600 }}>
                  {formatCOP(p.monthly_rate)}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {formatUSD(p.monthly_rate / TRM)}
                </div>
              </div>

              <button
                onClick={() => add(p)}
                style={{
                  marginTop: 12,
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

        {/* COTIZADOR */}
        <div style={{
          marginTop: 40,
          background: "#fff",
          borderRadius: 12,
          padding: 20
        }}>
          <h2 style={{ marginBottom: 15 }}>Cotización</h2>

          {selected.length === 0 && (
            <p style={{ color: "#888" }}>
              Agrega perfiles para comenzar
            </p>
          )}

          {selected.map(p => (
            <div key={p.id} style={{
              display: "grid",
              gridTemplateColumns: "2fr 80px 1fr 1fr 40px",
              alignItems: "center",
              gap: 10,
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
              />

              <span>{formatCOP(p.monthly_rate)}</span>
              <span>{formatCOP(p.monthly_rate * p.qty)}</span>

              <button
                onClick={() => remove(p.id)}
                style={{ color: "red", border: "none", background: "none" }}
              >
                ✕
              </button>
            </div>
          ))}

          <h2 style={{ textAlign: "right", marginTop: 20 }}>
            Total: {formatCOP(total)}
          </h2>
        </div>

      </div>
    </div>
  );
}
