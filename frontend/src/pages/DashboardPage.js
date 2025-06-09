
import React, { useState, useEffect } from 'react';
import { fetchSensorData, fetchPredictionData } from '../services/api';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

function DashboardPage() {
  const [selectedView, setSelectedView] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loadingSensor, setLoadingSensor] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [sensorError, setSensorError] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    loadSensorData();
    loadPredictionData();
  }, []);

  const loadSensorData = async () => {
    try {
      setLoadingSensor(true);
      const data = await fetchSensorData();
      setSensorData(data);
    } catch (err) {
      setSensorError('Failed to load sensor data');
    } finally {
      setLoadingSensor(false);
    }
  };

  const loadPredictionData = async () => {
    try {
      setLoadingPredictions(true);
      const data = await fetchPredictionData();
      setPredictions(data);
    } catch (err) {
      setPredictionError('Failed to load prediction data');
    } finally {
      setLoadingPredictions(false);
    }
  };

  const renderSensorReadings = () => {
    if (loadingSensor) return <p>Loading...</p>;
    if (sensorError) return <p style={{ color: 'red' }}>{sensorError}</p>;
    if (sensorData.length === 0) return <p>No sensor data available.</p>;

    return (
      <div style={gridStyle}>
        {sensorData.map((s, i) => (
          <div key={i} style={resultCardStyle}>
            <p><strong>🌡️ Temp:</strong> {s.temperature} °C</p>
            <p><strong>💧 Humidity:</strong> {s.humidity} %</p>
            <p><strong>🌿 Soil:</strong> {s.soil_moisture} %</p>
            <p style={timestampStyle}>{new Date(s.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderPredictions = () => {
    if (loadingPredictions) return <p>Loading...</p>;
    if (predictionError) return <p style={{ color: 'red' }}>{predictionError}</p>;
    if (predictions.length === 0) return <p>No predictions available.</p>;

    return (
      <div style={gridStyle}>
        {predictions.map((p, i) => (
          <div key={i} style={resultCardStyle}>
            <p><strong>Disease:</strong> {p.disease}</p>
            <p style={timestampStyle}>{new Date(p.timestamp).toLocaleString()}</p>
            {p.image_url && (
              <img
                src={p.image_url}
                alt="Leaf"
                style={imageStyle}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={wrapperStyle}>
      <Navbar />
      <div style={dashboardContainerStyle}>
        <h2 style={headerStyle}>Dashboard</h2>

        <div style={layoutStyle}>
          <div style={buttonListStyle}>
            <button
              style={buttonStyle(selectedView === 'sensor')}
              onClick={() => setSelectedView('sensor')}
            >
              🌱 Sensor Readings
            </button>
            <button
              style={buttonStyle(selectedView === 'prediction')}
              onClick={() => setSelectedView('prediction')}
            >
              🦠 Disease Predictions
            </button>
          </div>

          <div style={resultBoxStyle}>
            {selectedView === 'sensor'
              ? renderSensorReadings()
              : selectedView === 'prediction'
              ? renderPredictions()
              : <p style={{ color: '#888' }}>Please select to preview.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// === Styles ===
const wrapperStyle = {
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  minHeight: '100vh',
  backgroundColor: '#e5eff5',
  paddingBottom: 40,
};

const dashboardContainerStyle = {
  maxWidth: 1300,
  margin: '40px auto',
  padding: 24,
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.6)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
};

const headerStyle = {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 24,
  textAlign: 'left'
};

const layoutStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: 24,
};

const buttonListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  flex: 1,
};

const buttonStyle = (isActive) => ({
  padding: '12px 20px',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  backgroundColor: isActive ? '#4a90e2' : '#fff',
  color: isActive ? '#fff' : '#333',
  border: '1px solid #ccc',
  borderRadius: 8,
  transition: '0.3s',
});

const resultBoxStyle = {
  flex: 3,
  minHeight: 400,
  maxHeight: 600,
  overflowY: 'auto',
  backgroundColor: '#fdfdfd',
  padding: 16,
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  border: '1px solid #ddd',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 16,
};

const resultCardStyle = {
  backgroundColor: 'white',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  borderRadius: 8,
  padding: 16,
  fontSize: 14,
};

const timestampStyle = {
  color: '#666',
  fontSize: 12,
  marginTop: 8
};

const imageStyle = {
  marginTop: 8,
  width: '100%',
  borderRadius: 8,
  objectFit: 'cover'
};

export default DashboardPage;
