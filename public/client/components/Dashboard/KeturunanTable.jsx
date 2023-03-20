// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const KeturunanTable = () => {
//   const [keturunanList, setKeturunanList] = useState([]);

//   useEffect(() => {
//     axios.get('/api/keturunan')
//       .then(response => {
//         setKeturunanList(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Keturunan Table</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Nama</th>
//             <th>Usia</th>
//             <th>Jenis Kelamin</th>
//             <th>Input Keturunan</th>
//           </tr>
//         </thead>
//         <tbody>
//           {keturunanList.map(keturunan => (
//             <tr key={keturunan.id}>
//               <td>{keturunan.id}</td>
//               <td>{keturunan.nama}</td>
//               <td>{keturunan.usia}</td>
//               <td>{keturunan.jenis_kelamin}</td>
//               <td>{keturunan.input_keturunan}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default KeturunanTable;
import React, { useState } from 'react';

function KeturunanTable() {
  const [nama, setNama] = useState('');
  const [usia, setUsia] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [inputKeturunan, setInputKeturunan] = useState('');
  const [kemungkinanGen, setKemungkinanGen] = useState('');
  const [jenisInheritance, setJenisInheritance] = useState('');

  function hitungKemungkinanGenDariOrangTua(genOrangTua, kondisiGen) {
    let jumlahGenKondisi = 0;
    for (let i = 0; i < genOrangTua.length; i++) {
      if (genOrangTua[i] === kondisiGen) {
        jumlahGenKondisi++;
      }
    }
    let kemungkinanGen = jumlahGenKondisi / genOrangTua.length;
    return kemungkinanGen;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const genOrangTua = ['A', 'A', 'a', 'a'];
    const kemungkinanGen = hitungKemungkinanGenDariOrangTua(genOrangTua, inputKeturunan);
    if (kemungkinanGen === 0) {
      setJenisInheritance("Tidak mungkin terjadi");
    } else if (kemungkinanGen === 1) {
      setJenisInheritance("Wajib terjadi");
    } else {
      setJenisInheritance("Mungkin terjadi");
    }

    // Simpan data ke dalam tabel keturunan
    // Silakan tambahkan kode untuk menyimpan data ke dalam tabel keturunan di sini

    // Setelah data berhasil disimpan, tampilkan pesan berikut
    alert(`Data berhasil disimpan.\nKemungkinan gen yang diwarisi dari orang tua: ${kemungkinanGen}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="inputNama">Nama:</label>
        <input type="text" id="inputNama" name="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
        <label htmlFor="inputUsia">Usia:</label>
        <input type="number" id="inputUsia" name="usia" value={usia} onChange={(e) => setUsia(e.target.value)} required />

        <label htmlFor="inputJenisKelamin">Jenis Kelamin:</label>
        <select id="inputJenisKelamin" name="jenis_kelamin" value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} required>
          <option value="">-- Pilih Jenis Kelamin --</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>

        <label htmlFor="inputKeturunan">Keturunan:</label>
        <select id="inputKeturunan" name="keturunan" value={inputKeturunan} onChange={(e) => setInputKeturunan(e.target.value)} required>
            <option value="">-- Pilih Keturunan --</option>
            <option value="Jawa">Jawa</option>
            <option value="Sunda">Sunda</option>
            <option value="Batak">Batak</option>
            <option value="Minang">Minang</option>
            <option value="Betawi">Betawi</option>
            <option value="Bugis">Bugis</option>
            </select>
            <button type="submit">Submit</button>
    </form>
    {jenisInheritance && (
    <div>
    <h2>Hasil:</h2>
    <p>Nama: {nama}</p>
    <p>Usia: {usia}</p>
    <p>Jenis Kelamin: {jenisKelamin}</p>
    <p>Keturunan: {inputKeturunan}</p>
    <p>Jenis Inheritance: {jenisInheritance}</p>
    <p>Kemungkinan gen yang diwarisi dari orang tua: {kemungkinanGen}</p>
    </div>
    )}
    </div>
    );
    }

    export default KeturunanTable;