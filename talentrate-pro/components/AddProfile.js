
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { parseCSV } from '../utils/csv';

export default function AddProfile({onAdd}) {
  const [form, setForm] = useState({name:'',description:'',skills:'',monthly_rate:''});

  const save = async ()=>{
    const { data, error } = await supabase.from('profiles').insert([{
      name: form.name,
      description: form.description,
      skills: form.skills.split(','),
      monthly_rate: form.monthly_rate
    }]);
    if(!error) onAdd();
  };

  const handleCSV = (e)=>{
    parseCSV(e.target.files[0], async (rows)=>{
      await supabase.from('profiles').insert(rows);
      onAdd();
    });
  };

  return (
    <div className="p-4 border border-gray-700 rounded-xl">
      <h2 className="text-xl mb-2">Add Profile</h2>
      <input placeholder="Name" className="w-full p-2 mb-2 text-black"
        onChange={e=>setForm({...form,name:e.target.value})}/>
      <textarea placeholder="Description" className="w-full p-2 mb-2 text-black"
        onChange={e=>setForm({...form,description:e.target.value})}/>
      <input placeholder="Skills comma separated" className="w-full p-2 mb-2 text-black"
        onChange={e=>setForm({...form,skills:e.target.value})}/>
      <input placeholder="Monthly Rate" className="w-full p-2 mb-2 text-black"
        onChange={e=>setForm({...form,monthly_rate:e.target.value})}/>
      <button onClick={save} className="bg-cyan-500 px-4 py-2 rounded">Save</button>
      <input type="file" onChange={handleCSV} className="mt-2"/>
    </div>
  );
}
