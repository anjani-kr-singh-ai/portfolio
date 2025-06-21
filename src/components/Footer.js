import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full glass mt-10 py-10 text-white dark:text-white">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-center text-2xl sm:text-3xl font-semibold gap-3 text-center">
        <span role="img" aria-label="brain">🧠</span>
        Design with
        <span role="img" aria-label="heart" className="animate-pulse text-red-500">❤️</span>
        by a <span className="text-cyan-400">Coder</span>
      </div>
    </footer>
  );
};

export default Footer;
