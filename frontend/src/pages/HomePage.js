// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/Slider';

function HomePage() {
  return (
    <div style={styles.appContainer}>
      <Navbar />
      <main style={styles.mainContent}>
        <ImageSlider /> {/* Correctly using the ImageSlider component */}
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mainContent: {
    flex: 1,
    width: '100%',
  },
};

export default HomePage;
