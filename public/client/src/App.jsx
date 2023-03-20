import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import IdentifikasiPenyakitGenetik from './components/IdentifikasiPenyakitGenetik';
import IdentifikasiKorbanBencana from './components/IdentifikasiKorbanBencana';
import Keturunan from './components/Keturunan';
import PasanganHidup from './components/PasanganHidup';
import PenelitianIlmiah from './components/PenelitianIlmiah';
import PeningkatanKinerjaAtletik from './components/PeningkatanKinerjaAtletik';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginForm />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/identifikasi-penyakit-genetik">
          <IdentifikasiPenyakitGenetik />
        </Route>
        <Route exact path="/identifikasi-korban-bencana">
          <IdentifikasiKorbanBencana />
        </Route>
        <Route exact path="/keturunan">
          <Keturunan />
        </Route>
        <Route exact path="/pasangan-hidup">
          <PasanganHidup />
        </Route>
        <Route exact path="/penelitian-ilmiah">
          <PenelitianIlmiah />
        </Route>
        <Route exact path="/peningkatan-kinerja-atletik">
          <PeningkatanKinerjaAtletik />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
