import React from 'react';
import TotalData from '../components/Dashboard/TotalData';
import IdentifikasiPenyakitGenetikTable from '../components/Dashboard/IdentifikasiPenyakitGenetikTable';
import IdentifikasiKorbanBencanaTable from '../components/Dashboard/IdentifikasiKorbanBencanaTable';
import KeturunanTable from '../components/Dashboard/KeturunanTable';
import PasanganHidupTable from '../components/Dashboard/PasanganHidupTable';
import PenelitianIlmiahTable from '../components/Dashboard/PenelitianIlmiahTable';
import PeningkatanKinerjaAtletikTable from '../components/Dashboard/PeningkatanKinerjaAtletikTable';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <TotalData />
      <IdentifikasiPenyakitGenetikTable />
      <IdentifikasiKorbanBencanaTable />
      <KeturunanTable />
      <PasanganHidupTable />
      <PenelitianIlmiahTable />
      <PeningkatanKinerjaAtletikTable />
    </div>
  );
};

export default Dashboard;
