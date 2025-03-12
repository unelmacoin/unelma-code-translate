import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <main>
          <Component {...pageProps} />
        </main>
        <Toaster position="top-center" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
