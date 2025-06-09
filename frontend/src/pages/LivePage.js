import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import { fetchlivePredictionData } from '../services/api'; // your axios API function

function LivePage() {
  const [sensorData, setSensorData] = useState([]);
  const [loadingSensor, setLoadingSensor] = useState(false);
  const [sensorError, setSensorError] = useState(null);

  useEffect(() => {
    const loadLiveSensorData = async () => {
      try {
        setLoadingSensor(true);
        setSensorError(null);
        const data = await fetchlivePredictionData();
        setSensorData(data);
      } catch (err) {
        setSensorError('Failed to load sensor data');
      } finally {
        setLoadingSensor(false);
      }
    };

    loadLiveSensorData();
    const interval = setInterval(loadLiveSensorData, 180000);

    return () => clearInterval(interval);
  }, []);

  // Get the latest sensor entry based on timestamp
  const latestEntry = sensorData.length
    ? [...sensorData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
    : null;

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.header}>📡 Live Monitoring</h2>

          <div style={styles.innerContainer}>
            {/* Left: Live Camera Feed */}
            <div style={styles.leftPane}>
              <Card title="📷 Live Camera Feed">
                <div style={styles.videoBox}>
                  <iframe
                    src="http://your-esp32-cam-stream.local" // Replace with your ESP32-CAM stream URL
                    style={styles.iframe}
                    title="Live Camera"
                    allow="camera"
                  />
                </div>
              </Card>
            </div>

            {/* Right: Live Sensor Readings */}
            <div style={styles.rightPane}>
              <Card title="📊 Live Sensor Readings">
                {loadingSensor && <p>Loading sensor data...</p>}

                {sensorError && <p style={{ color: 'red' }}>{sensorError}</p>}

                {!loadingSensor && !sensorError && !latestEntry && (
                  <p>No live data available.</p>
                )}

                {!loadingSensor && !sensorError && latestEntry && (
                  <div style={styles.grid}>
                    {Object.entries(latestEntry).map(([key, value]) => {
                      if (key === 'timestamp') return null; // skip timestamp display
                      return (
                        <div key={key} style={styles.miniCard}>
                          <p>
                            <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                          </p>
                        </div>
                      );
                    })}
                    <div style={{ gridColumn: '1 / -1', fontSize: 12, color: '#666' }}>
                      Timestamp: {new Date(latestEntry.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: 20,
    maxWidth: 1200,
    margin: 'auto',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  contentWrapper: {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fefefe',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'left',
  },
  innerContainer: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
  },
  leftPane: {
    flex: 1,
    minWidth: 300,
  },
  rightPane: {
    flex: 1,
    minWidth: 300,
  },
  videoBox: {
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #ddd',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 15,
  },
  miniCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    boxShadow: '1px 1px 3px rgba(0,0,0,0.1)',
  },
};

export default LivePage;
