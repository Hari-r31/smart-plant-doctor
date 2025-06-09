import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Optional social icons

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerSection}>
          <h3 style={styles.footerHeading}>Smart Plant Doctor</h3>
          <p style={styles.footerText}>
            Helping you grow healthier plants through technology and AI.
          </p>
        </div>

        <div style={styles.footerSection}>
          <h4 style={styles.footerSubheading}>Quick Links</h4>
          <ul style={styles.linkList}>
            <li><a href="#" style={styles.footerLink}>Privacy Policy</a></li>
            <li><a href="#" style={styles.footerLink}>Terms of Service</a></li>
            <li><a href="#" style={styles.footerLink}>Contact Us</a></li>
          </ul>
        </div>

        {/* Optional social media section */}
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubheading}>Connect With Us</h4>
          <div style={styles.socialIcons}>
            <a href="#" style={styles.socialLink}><FaFacebook /></a>
            <a href="#" style={styles.socialLink}><FaTwitter /></a>
            <a href="#" style={styles.socialLink}><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div style={styles.copyright}>
        <p style={styles.copyrightText}>
          © {new Date().getFullYear()} Smart Plant Doctor. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#4CAF50',
    color: '#ecf0f1',
    padding: '40px 20px 20px',
    width: '100%',
    marginTop: 'auto',
  },
  footerContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '30px',
    height:"120px"
  },
  footerSection: {
    flex: '1',
    minWidth: '200px',
    marginBottom: '20px',
  },
  footerHeading: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#fff',
  },
  footerSubheading: {
    fontSize: '1.2rem',
    marginBottom: '15px',
    color: '#fff',
  },
  footerText: {
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  footerLink: {
    color: '#ecf0f1',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '10px',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#3498db',
    },
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
  },
  socialLink: {
    color: '#ecf0f1',
    fontSize: '1.5rem',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#3498db',
    },
  },
  copyright: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: '30px',
  },
  copyrightText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#bdc3c7',
  },
};

export default Footer;