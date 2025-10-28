import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- AÑADE ESTO ---
  test: {
    globals: true, // Para no tener que importar 'describe', 'it', 'expect'
    environment: 'jsdom', // Simula el DOM
    setupFiles: './src/test/setup.ts', // (Opcional, pero recomendado)
  },
  // --- FIN DE LA ADICIÓN ---
})