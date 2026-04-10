import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TRM = 4000; // puedes luego hacerlo dinámico

const seniorities = [
  "Intern",
  "Trainee",
  "Junior",
  "Junior Advanced",
  "Semi Senior",
  "Mid-Level",
  "Senior",
  "Senior Advanced",
  "Lead",
  "Principal",
  "Architect",
  "Manager",
  "Director"
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
    await supabase
      .from("profiles")
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
    (acc, p) => acc + p.monthly_rate * p.qty,
    0
  );

  const filteredProfiles = profiles
    .filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) &&
      (seniorityFilter ? p.seniority === seniorityFilter : true)
    )
    .slice(0, 4);

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh", padding: 40 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold" }}>TalentRate</h1>

        <button
          onClick={() => window.location.href = "/admin"}
          style={{ background: "#000", color: "#fff", padding: 10, borderRadius: 8 }}
        >
          + Crear Perfil
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
          style={{ width: 220 }}
        >
          <option value="">Todos</option>
          {seniorities.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
        marginTop: 30
      }}>
        {filteredProfiles.map(p => (
          <div key={p.id} style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            position: "relative"
          }}>
            <button
              onClick={() => setEditing(p)}
              style={{ position: "absolute", top: 10, right: 10 }}
            >✏️</button>

            <h3>{p.name}</h3>
            <p style={{ color: "#666" }}>{p.seniority}</p>

            <p style={{ fontWeight: "bold" }}>
              {formatCOP(p.monthly_rate)}
            </p>
            <p style={{ fontSize: 12, color: "#888" }}>
              {formatUSD(p.monthly_rate / TRM)}
            </p>

            <button
              onClick={() => add(p)}
              style={{ marginTop: 10, background: "#000", color: "#fff", padding: 6 }}
            >
              + Agregar
            </button>
          </div>
        ))}
      </div>

      {/* TABLA */}
      <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 900, background: "#fff", padding: 30, borderRadius: 12 }}>
          <h2>Cotización</h2>

          {selected.map(p => (
            <div key={p.id} style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 50px",
              marginTop: 10
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

              <button onClick={()=>remove(p.id)} style={{ color: "red" }}>✕</button>
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
