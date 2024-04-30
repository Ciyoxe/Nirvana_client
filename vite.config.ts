import { defineConfig } from 'vite'
import vue  from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@components" : path.resolve(__dirname, "src/components"),
            "@stores"     : path.resolve(__dirname, "src/stores"),
            "@pages"      : path.resolve(__dirname, "src/pages"),
            "@"           : path.resolve(__dirname, "src"),
        }
    }
})
