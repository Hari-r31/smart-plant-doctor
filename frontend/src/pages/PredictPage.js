import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

function PredictPage() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setPrediction(null);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const predictImage = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob);

    const apiUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/predict'
        : '/predict';

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Prediction failed');
    }

    return await response.json();
  };

  const handleUpload = async () => {
    if (!file) return setError('Please select an image first');

    try {
      setUploading(true);
      setError(null);
      setPrediction(null);

      const result = await predictImage(file);
      setPrediction(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'An error occurred during prediction');
    } finally {
      setUploading(false);
    }
  };

  const handleCaptureFromESP32 = async () => {
    setUploading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://192.168.0.50/capture');
      if (!response.ok) throw new Error('Failed to fetch image from ESP32-CAM');

      const blob = await response.blob();
      setPreview(URL.createObjectURL(blob));

      const result = await predictImage(blob);
      setPrediction(result);
    } catch (err) {
      console.error('ESP32 error:', err);
      setError(err.message || 'ESP32-CAM capture failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <main style={styles.mainContent}>
        <Card title="" style={styles.card}>
          <h2 style={styles.header}>Leaf Disease Prediction</h2>
          <div style={styles.row}>
            {/* Left Panel – Image + Upload */}
            <div style={styles.leftPanel}>
              {preview && <img src={preview} alt="Preview" style={styles.previewImage} />}
              <label style={styles.label}>Choose Leaf Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
              <div style={styles.buttonRow}>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !file}
                  style={{ ...styles.button, backgroundColor: '#4a90e2' }}
                >
                  {uploading ? 'Processing...' : 'Predict from File'}
                </button>
                <button
                  onClick={handleCaptureFromESP32}
                  disabled={uploading}
                  style={{ ...styles.button, backgroundColor: '#28a745' }}
                >
                  {uploading ? 'Capturing...' : 'Capture from ESP32-CAM'}
                </button>
              </div>
              {error && <p style={styles.errorText}>{error}</p>}
            </div>

            {/* Right Panel – Prediction Text */}
            {prediction && (
              <div style={styles.rightPanel}>
                <p><strong>Disease:</strong> {prediction.disease}</p>
                <p><strong>Symptoms:</strong> {prediction.symptoms}</p>
                <p><strong>Cause:</strong> {prediction.cause}</p>
                <p><strong>Precautions:</strong> {prediction.precautions}</p>
                <p><strong>Organic Remedies:</strong> {prediction.organic_remedies}</p>
                <p><strong>Chemical Treatment:</strong> {prediction.chemical_treatment}</p>
              </div>
            )}
          </div>
        </Card>

      </main>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#e5eff5',
    minHeight: '100vh',
  },
  mainContent: {
    padding: '10px 30px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    maxWidth: '1200px',
    width: '100%',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  flexContainer: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap', // allows responsive wrapping
  },

  leftPanel: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },

  rightPanel: {
    flex: 1,
    minWidth: '300px',
    maxHeight: '600px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    lineHeight: 3.9,
    marginTop:'-50px',

  },
    header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'left',
  },
  label: {
    fontWeight: 1200,
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    width:'450px',
  },
  button: {
    flex: 1,
    padding: '10px',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  previewImage: {
    width: '250px',
    height: '250px',
    objectFit: 'cover', // or 'contain' if you want full view
    borderRadius: '10px',
    border: '1px solid #ccc',
    marginTop: '10px',
    alignSelf: 'center',
  },
  errorText: {
    color: '#d9534f',
    fontWeight: '600',
  },
};

export default PredictPage;
