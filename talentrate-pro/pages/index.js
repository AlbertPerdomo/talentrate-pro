
import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { supabase } from '../lib/supabase';
import AddProfile from '../components/AddProfile';

export default function Home(){
  const [profiles,setProfiles]=useState([]);
  const [q,setQ]=useState("");

  const load=async ()=>{
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data||[]);
  };

  useEffect(()=>{load();},[]);

  const fuse = new Fuse(profiles,{keys:['name','description','skills']});
  const results = q ? fuse.search(q).map(r=>r.item) : profiles;

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-4">TalentRate</h1>

      <input className="w-full p-3 mb-6 text-black"
        placeholder="Search profile..."
        onChange={e=>setQ(e.target.value)}/>

      <div className="grid grid-cols-3 gap-4">
        {results.map(p=>(
          <div key={p.id} className="border border-gray-700 p-4 rounded-xl">
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <b>${p.monthly_rate}</b>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <AddProfile onAdd={load}/>
      </div>
    </div>
  );
}
