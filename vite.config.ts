import { defineConfig } from 'vite'
import { resolve } from 'path'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://kaizhuo.eadts.cn/addons/kaizhuo/h5/',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [uni()],

  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    proxy: {
      '/API': {
        target: 'https://kaizhuo.eadts.cn/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/API/, ''),
      },
    },
  },
})
