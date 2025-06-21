import React from 'react';
import './css/footer.css';

const CustomFooter = () => {
  return (
    <footer className="anjani-footer">
      <div className="anjani-footer-container">
        <div className="anjani-footer-main">
          <div className="anjani-footer-text">
            <span>Design with</span>
            <span className="emoji">🧠</span>
            <span>and</span>
            <span className="emoji heart">❤️</span>
            <span>by a <span className="coder">Coder</span></span>
          </div>
        </div>
        
        <div className="anjani-footer-info">
          <span className="anjani-footer-username">@anjani-kr-singh-ai</span>
          <span className="anjani-footer-separator">•</span>
          <span className="anjani-footer-timestamp">2025-06-21 04:46:26</span>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;