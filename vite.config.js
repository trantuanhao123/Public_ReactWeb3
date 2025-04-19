import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/Public_ReactWeb3/' : '/', // <-- THAY ĐỔI Ở ĐÂY
}))
