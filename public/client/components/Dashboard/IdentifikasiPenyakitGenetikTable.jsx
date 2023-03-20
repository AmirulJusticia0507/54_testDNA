// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const IdentifikasiPenyakitGenetikTable = () => {
//   const [data, setData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios.get('/api/identifikasi_penyakit_genetik');
//       setData(result.data);
//     };
//     fetchData();
//   }, []);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const filteredData = data.filter((item) =>
//     item.nama.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       <h2>Identifikasi Penyakit Genetik</h2>
//       <div>
//         <input
//           type="text"
//           placeholder="Search by name"
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Nama</th>
//             <th>Usia</th>
//             <th>Jenis Kelamin</th>
//             <th>Input Identifikasi Penyakit Genetik</th>
//             <th>Kemungkinan Kelainan Genetik</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((item) => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.nama}</td>
//               <td>{item.usia}</td>
//               <td>{item.jenis_kelamin}</td>
//               <td>{item.input_identifikasi_penyakit_genetik}</td>
//               <td>{item.kemungkinan_kelainan_genetik}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div>Total Data: {filteredData.length}</div>
//     </div>
//   );
// };

// export default IdentifikasiPenyakitGenetikTable;
import React, { useState } from 'react';
import axios from 'axios';

const IdentifikasiPenyakitGenetikTable = () => {
  const [nama, setNama] = useState('');
  const [usia, setUsia] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('L');
  const [inputIdentifikasi, setInputIdentifikasi] = useState('');
  const [kemungkinanKelainan, setKemungkinanKelainan] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // hitung kemungkinan adanya kelainan genetik berdasarkan data DNA
      const dataDNA = inputIdentifikasi.split('');
      const jumlahMutasi = dataDNA.filter((nukleotida) => nukleotida === 'G').length;
      const kemungkinanKelainanGenetik = jumlahMutasi / dataDNA.length;

      // simpan data ke dalam tabel identifikasi_penyakit_genetik
      const result = await axios.post('/api/identifikasi_penyakit_genetik', {
        nama,
        usia,
        jenis_kelamin: jenisKelamin,
        input_identifikasi_penyakit_genetik: inputIdentifikasi,
        kemungkinan_kelainan_genetik: kemungkinanKelainanGenetik,
      });

      if (result.status === 200) {
        // simpan hasil perhitungan kemungkinan kelainan genetik ke dalam state
        setKemungkinanKelainan(kemungkinanKelainanGenetik.toFixed(2));
        setIsSaved(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Identifikasi Penyakit Genetik</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nama">Nama:</label>
          <input type="text" id="nama" name="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="usia">Usia:</label>
          <input type="number" id="usia" name="usia" value={usia} onChange={(e) => setUsia(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="jenisKelamin">Jenis Kelamin:</label>
          <select id="jenisKelamin" name="jenis_kelamin" value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)}>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label htmlFor="inputIdentifikasi">Input Identifikasi:</label>
          <textarea id="inputIdentifikasi" name="input_identifikasi_penyakit_genetik" value={inputIdentifikasi} onChange={(e) => setInputIdentifikasi(e.target.value)} required />
        </div>
        <div>
          <button type="submit">Identifikasi</button>
        </div>
      </form>
      {isSaved && (
        <div>
          <h3>Hasil Identifikasi</h3>
          <p>Kemungkinan terkena kelainan genetik: {kemungkinanKelainan}</p>
        </div>
)}
    </div>
);
};

export default IdentifikasiPenyakitGenetikTable;
