import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
//livePlayer配置
import copy from 'rollup-plugin-copy';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        copy({
            targets: [
                {src: 'node_modules/@liveqing/liveplayer-v3/dist/component/liveplayer-lib.min.js', dest: 'public/js'},
            ]
        })
    ],
    server: {
        port: 9999,
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    }
})
