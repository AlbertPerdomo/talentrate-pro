import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const seniorities = [
  "Intern","Trainee","Junior","Junior Advanced",
  "Semi Senior","Mid-Level","Senior","Senior Advanced",
  "Lead","Principal","Architect","Manager","Director"
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
      .order("name", { ascending: true }); // 🔥 orden alfabético

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
    <div style={{ padding: 40 }}>
      <h1>Administrar Perfiles</h1>

      <div style={{ background: "#fff", padding: 20, marginTop: 20 }}>
        <input
          placeholder="Recurso"
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

        <button onClick={save}>Guardar</button>
      </div>

      <div style={{ background: "#fff", marginTop: 20, padding: 20 }}>
        {profiles.map(p => (
          <div key={p.id} style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
            padding: 10
          }}>
            <div>
              <strong>{p.name}</strong>
              <p>{p.seniority}</p>
            </div>

            <button onClick={()=>remove(p.id)} style={{ color: "red" }}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
