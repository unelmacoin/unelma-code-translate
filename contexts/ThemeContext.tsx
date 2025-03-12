import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => 
    typeof window !== 'undefined' && JSON.parse(localStorage.getItem('unelTheme') || 'false')
  );

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#131416' : '#fff';
  }, [isDark]);

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
