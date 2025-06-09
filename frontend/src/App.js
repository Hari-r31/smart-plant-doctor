import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LivePage from './pages/LivePage';
import PredictPage from './pages/PredictPage';

function App() {
  console.log("Rendering App component");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/predict" element={<PredictPage />} />
      </Routes>
    </Router>
  );
}

export default App;
