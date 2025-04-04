import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <ThemeProvider>
          <main>
            <Component {...pageProps} />
          </main>
          <Toaster position="top-center" />
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default App;
