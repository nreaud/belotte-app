// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import BeloteTeamsSetup from '../components/BeloteTeamsSetup.vue'
import BeloteGameView from '../components/BeloteGameView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: BeloteTeamsSetup
    },
    {
        path: '/game',
        name: 'game',
        component: BeloteGameView,
        props: route => ({
            initialTeams: route.params.teams ? JSON.parse(route.params.teams) : null
        })
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router