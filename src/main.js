import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue' // 引入所有图标，并命名为 Icons
const app = createApp(App);
for (let i in Icons) {
    app.component(i, Icons[i])
}
app.use(ElementPlus).mount('#app')
