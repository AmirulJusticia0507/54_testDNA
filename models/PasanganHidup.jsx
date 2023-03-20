// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PasanganHidup = () => {
//   const [pasangan, setPasangan] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios.get('/api/pasangan-hidup');
//       setPasangan(result.data);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h2>Daftar Pasangan Hidup</h2>
//       <ul>
//         {pasangan.map(item => (
//           <li key={item.id}>
//             {item.nama} ({item.usia} tahun)
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PasanganHidup;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasanganHidupService from './PasanganHidupService';

const PasanganHidup = () => {
  const [pasangan, setPasangan] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await PasanganHidupService.getAll();
      setPasangan(result.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Daftar Pasangan Hidup</h2>
      <ul>
        {pasangan.map(item => (
          <li key={item.id}>
            {item.nama} ({item.usia} tahun)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasanganHidup;
