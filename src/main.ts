import { createApp     } from 'vue'
import { createPinia   } from "pinia"
import { createVuetify } from 'vuetify'
import { aliases, mdi  } from 'vuetify/iconsets/mdi-svg';
import { createRouter, createWebHistory } from "vue-router";
import 'vuetify/styles'
import './style.scss'

import App from './App.vue'

const app     = createApp(App);
const pinia   = createPinia();
const vuetify = createVuetify({
    icons: {
        aliases,
        sets: { mdi },
    },
    theme: {
        defaultTheme: 'light'
    }
});
const router  = createRouter({
    history: createWebHistory(),
    routes : [
        { name: "login", path: '/auth/login', component: ()=> import('@pages/Login.vue') },
        { name: "register", path: '/auth/signup', component: ()=> import('@pages/Login.vue') },
        
        { name: "profile", path: '/profile/:id', component: ()=> import('@pages/Profile.vue') },
        { name: "profiles", path: '/profiles', component: ()=> import('@pages/Profiles.vue') },

        { name: "chat", path: '/chat/:id', component: ()=> import('@pages/Chat.vue') },
        { name: "chats", path: '/chats', component: ()=> import('@pages/Chats.vue') },

        { name: "anonchat", path: '/anonchat', component: ()=> import('@pages/Anonchat.vue') },

        { name: "post", path: '/post/:id', component: ()=> import('@pages/Posts.vue') },
        { name: "posts", path: '/posts', component: ()=> import('@pages/Posts.vue') },
        { name: "editor", path: '/editor', component: ()=> import('@pages/Postedit.vue') },
    ]
});

app
.use(vuetify)
.use(router)
.use(pinia)
.mount('#app');
