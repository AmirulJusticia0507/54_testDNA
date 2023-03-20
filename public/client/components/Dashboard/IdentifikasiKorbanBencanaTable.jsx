// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const IdentifikasiKorbanBencanaTable = () => {
//   const [identifikasiKorbanBencanaList, setIdentifikasiKorbanBencanaList] = useState([]);

//   useEffect(() => {
//     axios.get('/api/identifikasi-korban-bencana')
//       .then(response => {
//         setIdentifikasiKorbanBencanaList(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Identifikasi Korban Bencana Table</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Nama</th>
//             <th>Umur</th>
//             <th>Jenis Kelamin</th>
//             <th>Kondisi Kesehatan</th>
//             <th>Keterangan</th>
//           </tr>
//         </thead>
//         <tbody>
//           {identifikasiKorbanBencanaList.map(identifikasiKorbanBencana => (
//             <tr key={identifikasiKorbanBencana.id}>
//               <td>{identifikasiKorbanBencana.id}</td>
//               <td>{identifikasiKorbanBencana.nama}</td>
//               <td>{identifikasiKorbanBencana.umur}</td>
//               <td>{identifikasiKorbanBencana.jenis_kelamin}</td>
//               <td>{identifikasiKorbanBencana.kondisi_kesehatan}</td>
//               <td>{identifikasiKorbanBencana.keterangan}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default IdentifikasiKorbanBencanaTable;
import React, { useState } from "react";

function IdentifikasiKorbanBencanaTable() {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [kondisiKesehatan, setKondisiKesehatan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    //lakukan proses identifikasi korban bencana berdasarkan data yang diberikan
    if (umur < 5) {
      setKeterangan(`Korban bencana ${nama} berusia di bawah 5 tahun dan membutuhkan penanganan khusus.`);
    } else if (umur > 65) {
      setKeterangan(`Korban bencana ${nama} berusia di atas 65 tahun dan membutuhkan penanganan khusus.`);
    } else if (kondisiKesehatan === "Kritis") {
      setKeterangan(`Korban bencana ${nama} dalam kondisi kesehatan kritis dan membutuhkan penanganan khusus.`);
    } else {
      setKeterangan(`Korban bencana ${nama} tidak membutuhkan penanganan khusus.`);
    }

    //simpan data ke dalam tabel identifikasi_korban_bencana
    //Untuk melakukan simpan data ini Anda membutuhkan skrip untuk menghubungkan dengan database Anda.
    setIsSaved(true);
  }

  return (
    <div>
      <h2>Identifikasi Korban Bencana</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="inputNama">Nama:</label>
          <input type="text" id="inputNama" name="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="inputUmur">Umur:</label>
          <input type="number" id="inputUmur" name="umur" value={umur} onChange={(e) => setUmur(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="inputJenisKelamin">Jenis Kelamin:</label>
          <select id="inputJenisKelamin" name="jenis_kelamin" value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} required>
            <option value="">-- Pilih Jenis Kelamin --</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <div>
          <label htmlFor="inputKondisiKesehatan">Kondisi Kesehatan:</label>
          <select id="inputKondisiKesehatan" name="kondisi_kesehatan" value={kondisiKesehatan} onChange={(e) => setKondisiKesehatan(e.target.value)} required>
            <option value="">-- Pilih Kondisi Kesehatan --</option>
            <option value="Sehat">Sehat</option>
            <option value="Ringan">Ringan</option>
            <option value="Sedang">Sedang</option>
            <option value="Kritis">Kritis</option>
          </select>
        </div>
        <button type="submit">Identifikasi Korban Bencana</button>
      </form>
      {isSaved && <p>Data berhasil disimpan.</p>}
      {keterangan && <p>{keterangan}</p>}
    </div>
  );
}
export default IdentifikasiKorbanBencanaTable;
