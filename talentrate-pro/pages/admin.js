import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const seniorities = [
  "Intern","Trainee","Junior","Semi Senior","Senior","Lead","Architect"
];

export default function Admin() {

  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    seniority: "Junior",
    monthly_rate: ""
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("name", { ascending: true });

    setProfiles(data || []);
  };

  const save = async () => {
    await supabase.from("profiles").insert([form]);
    setForm({ name: "", seniority: "Junior", monthly_rate: "" });
    load();
  };

  const remove = async (id) => {
    await supabase.from("profiles").delete().eq("id", id);
    load();
  };

  return (
    <div>

      {/* HEADER */}
      <div className="container" style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Administrar Perfiles</h1>

        <button
          className="btn-ghost"
          onClick={() => window.location.href = "/"}
        >
          ← Volver
        </button>
      </div>

      {/* FORM */}
      <div className="container">
        <div className="card" style={{ display: "flex", gap: 10 }}>

          <input
            placeholder="Nombre del recurso"
            value={form.name}
            onChange={(e)=>setForm({...form, name:e.target.value})}
          />

          <select
            value={form.seniority}
            onChange={(e)=>setForm({...form, seniority:e.target.value})}
          >
            {seniorities.map(s => <option key={s}>{s}</option>)}
          </select>

          <input
            type="number"
            placeholder="Valor COP"
            value={form.monthly_rate}
            onChange={(e)=>setForm({...form, monthly_rate:e.target.value})}
          />

          <button className="btn-primary" onClick={save}>
            Guardar
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="container">
        <div className="card">

          {profiles.map(p => (
            <div key={p.id} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              borderBottom: "1px solid #eee"
            }}>
              <div>
                <strong>{p.name}</strong>
                <p style={{ fontSize: 12 }}>{p.seniority}</p>
              </div>

              <button
                onClick={()=>remove(p.id)}
                style={{ color: "red" }}
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
