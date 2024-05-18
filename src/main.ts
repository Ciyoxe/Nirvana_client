import { createApp    } from 'vue'
import { createPinia  } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import './normalize.css'
import './style.scss'

import App from './App.vue'

const pinia  = createPinia();
const app    = createApp(App);
const router = createRouter({
    history: createWebHistory(),
    routes : [
        { path: '/auth', component: ()=> import('@pages/Login.vue') },
        { path: '/profile/:id', component: ()=> import('@pages/Profile.vue') }
    ]
});

app
.use(router)
.use(pinia)
.mount('#app');
