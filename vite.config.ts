import { defineConfig } from 'vite'
import vue     from '@vitejs/plugin-vue'
import path    from 'path'
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
    plugins: [
        vue(), 
        vuetify({ autoImport: true })
    ],
    resolve: {
        alias: {
            "@components" : path.resolve(__dirname, "src/components"),
            "@uiblocks"   : path.resolve(__dirname, "src/uiblocks"),
            "@stores"     : path.resolve(__dirname, "src/stores"),
            "@pages"      : path.resolve(__dirname, "src/pages"),
            "@"           : path.resolve(__dirname, "src"),
        }
    }
})