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
    if (!form.name || !form.monthly_rate) return;

    await supabase.from("profiles").insert([form]);

    setForm({ name: "", seniority: "Junior", monthly_rate: "" });
    load();
  };

  const remove = async (id) => {
    await supabase.from("profiles").delete().eq("id", id);
    load();
  };

  return (
    <div style={{ background: "#f6f7f9", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 30 }}>

        <h1>Administrar Perfiles</h1>

        {/* FORM */}
        <div style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          marginTop: 20
        }}>
          <input
            placeholder="Nombre del recurso"
            value={form.name}
            onChange={(e)=>setForm({...form, name:e.target.value})}
          />

          <select
            value={form.seniority}
            onChange={(e)=>setForm({...form, seniority:e.target.value})}
            style={{ marginTop: 10 }}
          >
            {seniorities.map(s => <option key={s}>{s}</option>)}
          </select>

          <input
            type="number"
            placeholder="Valor mensual COP"
            value={form.monthly_rate}
            onChange={(e)=>setForm({...form, monthly_rate:e.target.value})}
            style={{ marginTop: 10 }}
          />

          <button
            onClick={save}
            style={{
              marginTop: 10,
              background: "#000",
              color: "#fff",
              padding: 10,
              borderRadius: 6
            }}
          >
            Guardar
          </button>
        </div>

        {/* LISTA */}
        <div style={{
          background: "#fff",
          marginTop: 20,
          borderRadius: 10,
          padding: 20
        }}>
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
                style={{ color: "red", background: "none", border: "none" }}
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
