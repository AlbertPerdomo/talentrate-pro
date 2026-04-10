import Papa from 'papaparse';
export function parseCSV(file, cb){
  Papa.parse(file, {
    header: true,
    complete: (res)=>cb(res.data)
  });
}
