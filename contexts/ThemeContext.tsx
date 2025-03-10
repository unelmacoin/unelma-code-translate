import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Change this to use the same key as index page
    const savedDarkMode = localStorage.getItem('unelTheme') === 'true';
    setIsDark(savedDarkMode);
    document.body.style.backgroundColor = savedDarkMode ? '#131416' : '#fff';
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('unelTheme', JSON.stringify(newIsDark));
    document.body.style.backgroundColor = newIsDark ? '#131416' : '#fff';
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
