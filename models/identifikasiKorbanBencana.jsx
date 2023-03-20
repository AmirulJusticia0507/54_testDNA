// import axios from "axios";

// const API_URL = "http://localhost:3000/api";

// class IdentifikasiKorbanBencanaService {
//     getAll() {
//         return axios.get(API_URL + "/identifikasi_korban_bencana");
//     }

//     get(id) {
//         return axios.get(API_URL + `/identifikasi_korban_bencana/${id}`);
//     }

//     create(data) {
//         return axios.post(API_URL + "/identifikasi_korban_bencana", data);
//     }

//     update(id, data) {
//         return axios.put(API_URL + `/identifikasi_korban_bencana/${id}`, data);
//     }

//     delete(id) {
//         return axios.delete(API_URL + `/identifikasi_korban_bencana/${id}`);
//     }

//     deleteAll() {
//         return axios.delete(API_URL + "/identifikasi_korban_bencana");
//     }

//     findByNama(nama) {
//         return axios.get(API_URL + `/identifikasi_korban_bencana?nama=${nama}`);
//     }
// }

// export default new IdentifikasiKorbanBencanaService();
import React, { useState, useEffect } from "react";
import IdentifikasiKorbanBencanaService from "./IdentifikasiKorbanBencanaService";

function IdentifikasiKorbanBencana() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await IdentifikasiKorbanBencanaService.getAll();
      setData(response.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <h2>{item.nama}</h2>
          <p>{item.lokasi}</p>
          <p>{item.status}</p>
        </div>
      ))}
    </div>
  );
}

export default IdentifikasiKorbanBencana;
