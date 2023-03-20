// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PasanganHidupTable = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios('/api/pasanganHidup');
//       setData(result.data);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h2>Pasangan Hidup</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Nama</th>
//             <th>Usia</th>
//             <th>Jenis Kelamin</th>
//             <th>Hobi</th>
//             <th>Pendidikan Terakhir</th>
//             <th>Status Hubungan</th>
//             <th>Waktu Input</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => (
//             <tr key={row.id}>
//               <td>{row.id}</td>
//               <td>{row.nama}</td>
//               <td>{row.usia}</td>
//               <td>{row.jenis_kelamin}</td>
//               <td>{row.hobi}</td>
//               <td>{row.pendidikan_terakhir}</td>
//               <td>{row.status_hubungan}</td>
//               <td>{row.waktu_input}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PasanganHidupTable;
import React, { useState } from "react";

function PasanganHidupTable() {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState(0);
  const [hobi, setHobi] = useState("");
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState("");
  const [statusHubungan, setStatusHubungan] = useState("");
  const [pasanganHidup, setPasanganHidup] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (umur >= 18 && umur <= 30 && pendidikanTerakhir === "S1" && statusHubungan === "Single" && (hobi === "musik" || hobi === "olahraga")) {
      setPasanganHidup(`Selamat ${nama}, Anda cocok dengan pasangan yang kami pilih`);

      // memasukkan data ke dalam tabel
      const data = {
        nama: nama,
        umur: umur,
        hobi: hobi,
        pendidikan_terakhir: pendidikanTerakhir,
        status_hubungan: statusHubungan
      };

      fetch("insertData.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setPasanganHidup(`Maaf ${nama}, kami tidak menemukan pasangan yang cocok untuk Anda`);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="inputNama">Nama:</label>
        <input type="text" id="inputNama" name="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
        <label htmlFor="inputUmur">Umur:</label>
        <input type="number" id="inputUmur" name="umur" value={umur} onChange={(e) => setUmur(e.target.value)} required />
        <label htmlFor="inputHobi">Hobi:</label>
        <select id="inputHobi" name="hobi" value={hobi} onChange={(e) => setHobi(e.target.value)} required>
          <option value="">-- Pilih Hobi --</option>
          <option value="musik">Musik</option>
          <option value="olahraga">Olahraga</option>
          <option value="traveling">Traveling</option>
          <option value="makan">Makan</option>
        </select>
        <label htmlFor="inputPendidikanTerakhir">Pendidikan Terakhir:</label>
        <select id="inputPendidikanTerakhir" name="pendidikan_terakhir" value={pendidikanTerakhir} onChange={(e) => setPendidikanTerakhir(e.target.value)} required>
            <option value="">-- Pilih Pendidikan Terakhir --</option>
            <option value="SMA">SMA</option>
            <option value="D3">D3</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
            </select>
        <label htmlFor="inputStatusHubungan">Status Hubungan:</label>
        <select id="inputStatusHubungan" name="status_hubungan" value={statusHubungan} onChange={(e) => setStatusHubungan(e.target.value)} required>
            <option value="">-- Pilih Status Hubungan --</option>
            <option value="Single">Single</option>
            <option value="Menikah">Menikah</option>
            <option value="Duda">Duda</option>
            <option value="Janda">Janda</option>
        </select>
        <button type="submit">Cari Pasangan</button>
</form>
{pasangan && (
<div>
<h2>Pasangan yang cocok untuk Anda:</h2>
<table>
<thead>
<tr>
<th>Nama</th>
<th>Umur</th>
<th>Hobi</th>
<th>Pendidikan Terakhir</th>
<th>Status Hubungan</th>
</tr>
</thead>
<tbody>
<tr>
<td>{pasangan.nama}</td>
<td>{pasangan.umur}</td>
<td>{pasangan.hobi}</td>
<td>{pasangan.pendidikanTerakhir}</td>
<td>{pasangan.statusHubungan}</td>
</tr>
</tbody>
</table>
</div>
)}
</div>
);
}

export default PasanganHidupTable;
