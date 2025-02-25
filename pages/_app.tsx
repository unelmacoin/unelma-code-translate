import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Nav from '../components/Nav';

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <AuthProvider>
      <main className={inter.className}>
        <Nav isDark={false} toggleDarkMode={() => {}} />
        <Component {...pageProps} />
      </main>
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;
