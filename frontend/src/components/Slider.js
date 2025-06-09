import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from '../assets/Monitor-Your-Plants-Live.jpg';
import img2 from '../assets/Predict-Plant-Diseases.jpg';
import img3 from '../assets/Visualize-Your-Garden-Dashboard.jpg';

const slides = [
  {
    title: "Monitor Your Plants Live 🌱",
    description: "Get real-time updates on soil moisture, temperature, humidity, and more.",
    image: img1,
  },
  {
    title: "Predict Plant Diseases 🧪",
    description: "Use AI to detect diseases early from leaf images and keep your plants healthy.",
    image: img2,
  },
  {
    title: "Visualize Your Garden Dashboard 📊",
    description: "Track historical data and trends to optimize your gardening routine.",
    image: img3,
  }
];

const SampleNextArrow = ({ onClick }) => (
  <div 
    className="arrow next"
    onClick={onClick}
  >
    ›
  </div>
);

const SamplePrevArrow = ({ onClick }) => (
  <div 
    className="arrow prev"
    onClick={onClick}
  >
    ‹
  </div>
);

const ImageSlider = () => {
  const sliderRef = React.useRef();

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: '0',
  };

  return (
    <div className="slider-container">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slide-container">
            <div 
              className="background-image"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="slide-content">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="slide-image"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/800x450?text=Image+Not+Found";
                }}
              />
              <div className="text-overlay">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <SamplePrevArrow onClick={() => sliderRef.current.slickPrev()} />
      <SampleNextArrow onClick={() => sliderRef.current.slickNext()} />
      
      <style jsx>{`
        .slider-container {
          position: relative;
          width: 100%;
          height: 93vh;
          min-height: 500px;
          overflow: hidden;
        }
        
        .slide-container {
          position: relative;
          height: 93vh;
          min-height: 500px;
          display: flex !important;
          justify-content: center;
          align-items: center;
        }
        
        .background-image {
          position: absolute;
          width: 110%;
          height: 110%;
          background-size: cover;
          background-position: center;
          filter: blur(15px) brightness(0.7);
          z-index: 0;
        }
        
        .slide-content {
          position: relative;
          z-index: 1;
          width: 80%;
          max-width: 1200px;
          height: 80%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        
        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .text-overlay {
          position: absolute;
          top: 40;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          padding: 40px;
          text-align: center;
        }
        
        .slide-title {
          font-size: 2.5rem;
          margin-bottom: 20px;
          font-weight: bold;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
        }
        
        .slide-description {
          font-size: 1.2rem;
          line-height: 1.6;
          max-width: 800px;
        }
        
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.7);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          font-size: 2rem;
          font-weight: bold;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
        }
        
        .arrow.prev {
          left: 20px;
        }
        
        .arrow.next {
          right: 20px;
        }
        
        @media (max-width: 768px) {
          .slide-title {
            font-size: 1.8rem;
          }
          
          .slide-description {
            font-size: 1rem;
          }
          
          .slide-content {
            width: 90%;
            height: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;