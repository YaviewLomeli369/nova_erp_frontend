import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '3a5fcf8f-8016-4844-8163-0c17e935910e-00-2govrrno8qmvs.worf.replit.dev'
    ]
  }
})
