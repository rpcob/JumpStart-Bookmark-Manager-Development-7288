import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { backgroundImage } = useBookmarks();
  const { theme, transparentCollections } = useTheme();

  return (
    <div className="min-h-screen relative">
      {backgroundImage && (
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            filter: `brightness(${theme === 'dark' ? '0.3' : '0.7'}) ${transparentCollections ? 'blur(5px)' : ''}`,
            zIndex: -1,
          }} 
        />
      )}
      
      <Header />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;