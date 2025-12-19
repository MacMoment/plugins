import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get API URL from environment or use default
  const apiUrl = env.VITE_API_URL || 'http://localhost:3001/api';
  const apiHost = new URL(apiUrl).origin;
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: '0.0.0.0', // Allow access from external IPs on VPS
      proxy: {
        '/api': {
          target: apiHost,
          changeOrigin: true
        }
      }
    },
    preview: {
      port: 5173,
      host: '0.0.0.0' // Allow access from external IPs on VPS
    }
  };
});
