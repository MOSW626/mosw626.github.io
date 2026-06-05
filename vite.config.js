import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 사용자 Pages 레포(mosw626.github.io)라 루트 서빙
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
