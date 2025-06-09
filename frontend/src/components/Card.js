import React from 'react';

function Card({ title, children, style }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 10,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      padding: 20,
      marginTop: 20,
      ...style,
    }}>
      {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
      {children}
    </div>
  );
}

export default Card;
