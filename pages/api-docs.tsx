import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import Swagger UI with SSR disabled
const SwaggerUI = dynamic<{
  spec?: object | string;
  url?: string;
  docExpansion?: 'list' | 'full' | 'none';
  defaultModelExpandDepth?: number;
  displayRequestDuration?: boolean;
  filter?: boolean | string;
  persistAuthorization?: boolean;
}>(
  () => import('swagger-ui-react').then(mod => mod.default),
  { ssr: false }
);

// Import Swagger UI styles
import 'swagger-ui-react/swagger-ui.css';

const APIDocs: NextPage = () => {
  // State for mounting check (for SSR compatibility)
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>API Documentation - Unelma Code Translate</title>
        <meta name="description" content="Interactive API documentation for Unelma Code Translate service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
            <p className="mt-2 text-gray-600">
              Interactive documentation for the Unelma Code Translate API
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {mounted && (
              <SwaggerUI 
                url="/api/swagger.json"
                docExpansion="list"
                defaultModelExpandDepth={3}
                displayRequestDuration={true}
                filter={true}
                persistAuthorization={true}
              />
            )}
          </div>
          
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  For any questions or issues, please contact our support team at{' '}
                  <a 
                    href="mailto:info@unelmaplatforms.com" 
                    className="font-medium underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    info@unelmaplatforms.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default APIDocs;
