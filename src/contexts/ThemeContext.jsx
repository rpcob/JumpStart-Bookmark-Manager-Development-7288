import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [transparentCollections, setTransparentCollections] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('jumpstart_theme');
    const storedTransparent = localStorage.getItem('jumpstart_transparent');
    
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    if (storedTransparent) {
      setTransparentCollections(JSON.parse(storedTransparent));
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('jumpstart_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('jumpstart_transparent', JSON.stringify(transparentCollections));
  }, [transparentCollections]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleTransparentCollections = () => {
    setTransparentCollections(prev => !prev);
  };

  const value = {
    theme,
    transparentCollections,
    toggleTheme,
    toggleTransparentCollections,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};