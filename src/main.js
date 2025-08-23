import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css' // 使用Bootstrap实现响应式
import 'bootstrap-icons/font/bootstrap-icons.css' // Bootstrap Icons
import '@fortawesome/fontawesome-free/css/all.min.css' // FontAwesome
import './firebaseConfig.js' // 导入 Firebase 配置

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
