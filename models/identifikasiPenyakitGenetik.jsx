// import axios from "axios";

// const API_URL = "http://localhost:3000/api";

// class IdentifikasiPenyakitGenetikService {
//     getAll() {
//         return axios.get(API_URL + "/identifikasi_penyakit_genetik");
//     }

//     get(id) {
//         return axios.get(API_URL + `/identifikasi_penyakit_genetik/${id}`);
//     }

//     create(data) {
//         return axios.post(API_URL + "/identifikasi_penyakit_genetik", data);
//     }

//     update(id, data) {
//         return axios.put(API_URL + `/identifikasi_penyakit_genetik/${id}`, data);
//     }

//     delete(id) {
//         return axios.delete(API_URL + `/identifikasi_penyakit_genetik/${id}`);
//     }

//     deleteAll() {
//         return axios.delete(API_URL + "/identifikasi_penyakit_genetik");
//     }

//     findByNama(nama) {
//         return axios.get(API_URL + `/identifikasi_penyakit_genetik?nama=${nama}`);
//     }
// }

// export default new IdentifikasiPenyakitGenetikService();
import React, { useState, useEffect } from "react";
// import axios from "axios";
import IdentifikasiPenyakitGenetikService from "./IdentifikasiPenyakitGenetikService";

function IdentifikasiPenyakitGenetik() {
  const [data, setData] = useState([]);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = () => {
    IdentifikasiPenyakitGenetikService.getAll()
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <h2>{item.nama}</h2>
          <p>{item.jenis_penyakit}</p>
          <p>{item.lokasi}</p>
        </div>
      ))}
    </div>
  );
}

export default IdentifikasiPenyakitGenetik;
