import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/Public_ReactWeb3/' : '/', // ✅ CHẮC CHẮN có dấu "/" cuối
}))
