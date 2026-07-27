// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PeningkatanKinerjaAtletikTable = () => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState('');
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios.get('/api/peningkatan_kinerja_atletik');
//       setData(result.data);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     setFilteredData(
//       data.filter((item) =>
//         item.nama.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, data]);

//   return (
//     <div>
//       <h2>Peningkatan Kinerja Atletik</h2>
//       <input
//         type="text"
//         placeholder="Cari Nama"
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Nama</th>
//             <th>Usia</th>
//             <th>Jenis Kelamin</th>
//             <th>Nilai Awal</th>
//             <th>Nilai Akhir</th>
//             <th>Peningkatan Kinerja</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((item) => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.nama}</td>
//               <td>{item.usia}</td>
//               <td>{item.jenis_kelamin}</td>
//               <td>{item.nilai_awal}</td>
//               <td>{item.nilai_akhir}</td>
//               <td>{item.peningkatan_kinerja}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PeningkatanKinerjaAtletikTable;
import React, { useState } from 'react';

function PeningkatanKinerjaAtletikTable() {
  const [nama, setNama] = useState('');
  const [usia, setUsia] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [nilaiAwal, setNilaiAwal] = useState('');
  const [nilaiAkhir, setNilaiAkhir] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // hitung peningkatan kinerja atletik menggunakan rumus yang sesuai
    const peningkatanKinerja = ((nilaiAkhir - nilaiAwal) / nilaiAwal) * 100;

    // simpan data ke dalam tabel peningkatan_kinerja_atletik
    fetch('/peningkatan-kinerja-atletik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, usia: Number(usia), jenis_kelamin: jenisKelamin, nilai_awal: Number(nilaiAwal), nilai_akhir: Number(nilaiAkhir), peningkatan_kinerja: String(peningkatanKinerja) }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="inputNama">Nama:</label>
        <input
          type="text"
          id="inputNama"
          name="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <label htmlFor="inputUsia">Usia:</label>
        <input
          type="number"
          id="inputUsia"
          name="usia"
          value={usia}
          onChange={(e) => setUsia(e.target.value)}
          required
        />
        <label htmlFor="inputJenisKelamin">Jenis Kelamin:</label>
        <select
          id="inputJenisKelamin"
          name="jenis_kelamin"
          value={jenisKelamin}
          onChange={(e) => setJenisKelamin(e.target.value)}
          required
        >
          <option value="">-- Pilih Jenis Kelamin --</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
        <label htmlFor="inputNilaiAwal">Nilai Awal:</label>
        <input
          type="number"
          id="inputNilaiAwal"
          name="nilai_awal"
          value={nilaiAwal}
          onChange={(e) => setNilaiAwal(e.target.value)}
          required
        />
        <label htmlFor="inputNilaiAkhir">Nilai Akhir:</label>
        <input
          type="number"
          id="inputNilaiAkhir"
          name="nilai_akhir"
          value={nilaiAkhir}
          onChange={(e) => setNilaiAkhir(e.target.value)}
          required
        />
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}

export default PeningkatanKinerjaAtletikTable;
