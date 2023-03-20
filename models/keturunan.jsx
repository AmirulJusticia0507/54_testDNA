// import axios from "axios";

// const API_URL = "http://localhost:3000/api";

// class KeturunanService {
//     getAll() {
//         return axios.get(API_URL + "/keturunan");
//     }

//     get(id) {
//         return axios.get(API_URL + `/keturunan/${id}`);
//     }

//     create(data) {
//         return axios.post(API_URL + "/keturunan", data);
//     }

//     update(id, data) {
//         return axios.put(API_URL + `/keturunan/${id}`, data);
//     }

//     delete(id) {
//         return axios.delete(API_URL + `/keturunan/${id}`);
//     }

//     deleteAll() {
//         return axios.delete(API_URL + "/keturunan");
//     }

//     findByNama(nama) {
//         return axios.get(API_URL + `/keturunan?nama=${nama}`);
//     }
// }

// export default new KeturunanService();
import axios from "axios";

const API_URL = "http://localhost:3000/api";

class KeturunanService {
    async getAll() {
        const response = await axios.get(API_URL + "/keturunan");
        return response.data;
    }

    async get(id) {
        const response = await axios.get(API_URL + `/keturunan/${id}`);
        return response.data;
    }

    async create(data) {
        const response = await axios.post(API_URL + "/keturunan", data);
        return response.data;
    }

    async update(id, data) {
        const response = await axios.put(API_URL + `/keturunan/${id}`, data);
        return response.data;
    }

    async delete(id) {
        const response = await axios.delete(API_URL + `/keturunan/${id}`);
        return response.data;
    }

    async deleteAll() {
        const response = await axios.delete(API_URL + "/keturunan");
        return response.data;
    }

    async findByNama(nama) {
        const response = await axios.get(API_URL + `/keturunan?nama=${nama}`);
        return response.data;
    }
}

export default new KeturunanService();
