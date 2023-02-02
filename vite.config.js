import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import requireTransform from 'vite-plugin-require-transform'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // requireTransform.default({
    //   fileRegex: /.js$|.vue$/
    // }),
    // 自动导入相关函数
    // AutoImport({
    //   imports: ['vue','vue-router']
    // }),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  server: {
    proxy: {
      '/api': { //用于转发以http://localhost:5173/api开头的所有请求
        target: 'http://localhost:3000', //根路径替换项目根路径
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
            
      }
    },
    open: true,
    http: true,
    ssr: true,
    host: '0.0.0.0'
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }

})
