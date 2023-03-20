// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PenelitianIlmiahTable = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios('/api/penelitianIlmiah');
//       setData(result.data);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h2>Penelitian Ilmiah</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Nama</th>
//             <th>Usia</th>
//             <th>Jenis Kelamin</th>
//             <th>Input Penelitian Ilmiah</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => (
//             <tr key={row.id}>
//               <td>{row.id}</td>
//               <td>{row.nama}</td>
//               <td>{row.usia}</td>
//               <td>{row.jenis_kelamin}</td>
//               <td>{row.input_penelitian_ilmiah}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PenelitianIlmiahTable;
import React, { useState } from "react";
import axios from "axios";

function PenelitianIlmiahTable() {
  const [nama, setNama] = useState("");
  const [usia, setUsia] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [inputPenelitianIlmiah, setInputPenelitianIlmiah] = useState("");
  const [korelasi, setKorelasi] = useState("");

  // definisi fungsi hitungKorelasi()
  function hitungKorelasi(data1, data2) {
    // hitung korelasi antara dua variabel menggunakan analisis statistik
    // gunakan algoritma dan rumus matematika yang sesuai
    // contoh:
    const jumlahData = data1.length;
    const rata2Data1 = data1.reduce((a, b) => a + b, 0) / jumlahData;
    const rata2Data2 = data2.reduce((a, b) => a + b, 0) / jumlahData;
    let pembilang = 0;
    let penyebut1 = 0;
    let penyebut2 = 0;
    for (let i = 0; i < jumlahData; i++) {
      pembilang += (data1[i] - rata2Data1) * (data2[i] - rata2Data2);
      penyebut1 += Math.pow(data1[i] - rata2Data1, 2);
      penyebut2 += Math.pow(data2[i] - rata2Data2, 2);
    }
    const penyebut = Math.sqrt(penyebut1) * Math.sqrt(penyebut2);
    const korelasi = pembilang / penyebut;
    return korelasi;
  }

  function handleSubmit(event) {
    event.preventDefault();

    // hitung korelasi antara dua variabel menggunakan fungsi hitungKorelasi()
    const data1 = [1, 2, 3, 4, 5];
    const data2 = [3, 6, 9, 12, 15];
    const korelasi = hitungKorelasi(data1, data2);
    setKorelasi(korelasi);

    // simpan data ke dalam tabel penelitian_ilmiah menggunakan AJAX
    axios
      .post("/simpan_data.php", {
        nama,
        usia,
        jenis_kelamin: jenisKelamin,
        input_penelitian_ilmiah: inputPenelitianIlmiah,
        korelasi,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="inputNama">Nama:</label>
        <input type="text" id="inputNama" name="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
        <label htmlFor="inputUsia">Usia:</label>
        <input type="number" id="inputUsia" name="usia" value={usia} onChange={(e) => setUsia(e.target.value)} required
/>
<label htmlFor="inputJenisKelamin">Jenis Kelamin:</label>
<select
id="inputJenisKelamin"
name="jenis_kelamin"
value={jenisKelamin}
onChange={(e) => setJenisKelamin(e.target.value)}
required
>
<option value="">Pilih Jenis Kelamin</option>
<option value="Laki-laki">Laki-laki</option>
<option value="Perempuan">Perempuan</option>
</select>
<label htmlFor="inputPenelitianIlmiah">Input Penelitian Ilmiah:</label>
<textarea
id="inputPenelitianIlmiah"
name="input_penelitian_ilmiah"
value={inputPenelitianIlmiah}
onChange={(e) => setInputPenelitianIlmiah(e.target.value)}
required
></textarea>
<button type="submit">Simpan</button>
</form>
{korelasi !== "" && (
<p>
Korelasi antara data1 dan data2 adalah: <strong>{korelasi}</strong>
</p>
)}
</div>
);
}

export default PenelitianIlmiahTable;
