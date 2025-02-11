import { createRouter, createWebHistory } from 'vue-router'
import {auth} from "@/db/firebase"
const routes = [
  {
    path: '/',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('../views/PerfilView.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/preguntas',
    name: 'preguntas',
    component: () => import('../views/PreguntasView.vue'),
    meta: {requiresAuth: true}
  }
]

const router = createRouter({
  history: createWebHistory('process.env.BASE_URL'),
  routes
})

router.beforeEach( (to, from, next)  => {
  const requiresAuth = to.matched.some( (record) => record.meta.requiresAuth)
  const unsubscribe = auth.onAuthStateChanged( (user) => {
    
    if(requiresAuth && !user){
      next({name: 'login'})
    }else if (requiresAuth && user && !user.emailVerified){
      next(false)
    }else{
      next() // permite la navegacion a la ruta deseada
    }
    unsubscribe() // dejar de hacer el seguimiento de las rutas
  })
})
export default router
