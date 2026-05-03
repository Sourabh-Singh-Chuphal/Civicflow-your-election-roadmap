import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Code splitting for better performance
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['motion'],
            'vendor-lucide': ['lucide-react'],
            'vendor-genai': ['@google/genai'],
          },
        },
      },
      // Increase warning threshold since we've properly split chunks
      chunkSizeWarningLimit: 600,
      // Enable source maps for production debugging
      sourcemap: false,
      // Minification
      minify: 'esbuild',
      target: 'es2020',
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
