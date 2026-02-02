import './global.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VersionBadge } from '@psp/ui';
import { routeTree } from './routeTree.gen';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Create the router
const router = createRouter({ routeTree });

// Type-safe router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Version info from build-time env
const gitCommit = import.meta.env.VITE_GIT_COMMIT || 'dev';
const buildTime = import.meta.env.VITE_BUILD_TIME;

// Render
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <VersionBadge version={gitCommit} buildTime={buildTime} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
