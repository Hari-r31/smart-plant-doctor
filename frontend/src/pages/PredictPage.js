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
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setError(null);
      setPrediction(null); // Clear previous results
      
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8000/predict' 
        : '/predict';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'An error occurred during prediction');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <main style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          {/* Upload Card - Left Side */}
          <div style={styles.uploadSection}>
            <Card title="Upload Leaf Image" style={styles.card}>
              <div style={styles.inputGroup}>
                <label htmlFor="leafImage" style={styles.fileInputLabel}>
                  {file ? file.name : 'Choose an image'}
                  <input
                    id="leafImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                    disabled={uploading}
                  />
                </label>

                {preview && (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={styles.previewImage} 
                  />
                )}

                <button
                  onClick={handleUpload}
                  style={{
                    ...styles.uploadButton,
                    ...(uploading ? styles.disabledButton : {})
                  }}
                  disabled={uploading || !file}
                  aria-busy={uploading}
                >
                  {uploading ? 'Processing...' : 'Predict'}
                </button>
              </div>

              {error && <p style={styles.errorText}>{error}</p>}
            </Card>
          </div>

          {/* Results Card - Right Side */}
          <div style={styles.resultSection}>
            {prediction ? (
              <Card title="Prediction Result" style={styles.card}>
                <div style={styles.predictionResult}>
                  <p style={styles.predictionText}>
                    <strong>Disease:</strong> {prediction.disease}
                  </p>
                  {prediction.image_url ? (
                    <img
                      src={prediction.image_url}
                      alt="Predicted leaf analysis"
                      style={styles.predictedImage}
                    />
                  ) : (
                    <p style={styles.noImageText}>No image available</p>
                  )}
                </div>
              </Card>
            ) : (
              <Card title="Results" style={styles.card}>
                <p style={styles.placeholderText}>
                  {uploading ? 'Analyzing your image...' : 'Upload an image to get started'}
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#e5eff5',
  },
  mainContent: {
    padding: '20px 0 40px',
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    gap: '40px',
  },
  uploadSection: {
    flex: 1,
    minWidth: '400px',
  },
  resultSection: {
    flex: 1,
    minWidth: '400px',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flex: 1,
  },
  fileInputLabel: {
    display: 'block',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#e9ecef',
    },
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    padding: '12px 0',
    backgroundColor: '#4a90e2',
    color: '#fff',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#357abd',
    },
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  errorText: {
    marginTop: '15px',
    color: '#d9534f',
    fontWeight: '600',
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    borderRadius: '8px',
    margin: '10px 0',
  },
  predictionResult: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    height: '100%',
  },
  predictionText: {
    fontWeight: '600',
    fontSize: '18px',
    margin: 0,
  },
  predictedImage: {
    width: '100%',
    borderRadius: '12px',
    objectFit: 'contain',
    maxHeight: '350px',
    flex: 1,
  },
  noImageText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    margin: '40px 0',
  },
};

export default PredictPage;