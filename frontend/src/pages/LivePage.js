import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import { fetchlivePredictionData } from '../services/api';

function LivePage() {
  const [sensorData, setSensorData] = useState([]);
  const [loadingSensor, setLoadingSensor] = useState(false);
  const [sensorError, setSensorError] = useState(null);
  const videoContainerRef = useRef(null);

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

  const latestEntry = sensorData.length
    ? [...sensorData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
    : null;

  const handleFullscreen = () => {
    const elem = videoContainerRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.header}>Live Monitoring</h2>

          <Card title={null}>
            <div ref={videoContainerRef} style={styles.fullscreenWrapper}>
              <iframe
                src="http://192.168.0.50/stream"
                style={styles.fullscreenVideo}
                title="Live Camera"
                allow="camera"
              />

              {/* Sensor readings overlay */}
              {latestEntry && (
                <div style={styles.sensorOverlay}>
                  {Object.entries(latestEntry).map(([key, value]) => {
                    if (key === 'timestamp' || key === 'id') return null;
                    return (
                      <div key={key} style={styles.sensorItem}>
                        <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                      </div>
                    );
                  })}
                  <div style={styles.timestamp}>
                    {new Date(latestEntry.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: 20,
    maxWidth: 1400,
    margin: 'auto',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  contentWrapper: {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'left',
    color: '#222',
  },
  fullscreenWrapper: {
    position: 'Right',
    width: '100%',
    maxWidth: '804px',   // Match XGA width
    height: '604px', 
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    border: '2px solid #000',
    aspectRatio: '4 / 3', 
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    objectFit: 'cover', // if you want exact fill
  },
  sensorOverlay: {
    position: 'absolute',
    top: 230,
    right: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '14px 16px',
    border: '1px solid #333',
    borderRadius: 8,
    fontSize: 14,
    lineHeight: '2.9',
    maxWidth: 440,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  sensorItem: {
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    textAlign: 'right',
  },
};

export default LivePage;
