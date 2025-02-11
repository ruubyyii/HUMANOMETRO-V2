<template>
    <section class="">
      <Toaster />
      <h2 class="">Acceder</h2>
      <p class="">Si ya tienes una cuenta, inicia sesión y accede al formulario.</p>
      <form @submit.prevent="login">
          <input type="email" class="" v-model="email" placeholder="Correo electrónico" required>
          <input type="password" class="" v-model="password" placeholder="Contraseña" required>
          <button type="submit" class="">Acceder</button>
      </form>
      <p class="">¿No tienes cuenta? <router-link class="" to="/">inicia sesión</router-link></p>
    </section>
  </template>
  
  <script>
  import {auth} from '@/db/firebase'
  import {signInWithEmailAndPassword} from 'firebase/auth'
  import { Toaster, toast } from 'vue-sonner'
  export default {
      name:'LoginView',
      components:{
          Toaster
      },
      data(){
          return{
              email: '',
              password: ''
          }
      },
      methods:{
          async login(){
              try {
                  const userCredentials = await signInWithEmailAndPassword (auth, this.email, this.password)
                  const user = userCredentials.user
                  console.log(user);
                  if (!user.emailVerified){
                    toast.warning('Por favor verifica tu correo electrónico para continuar.')
                  }else{
                    this.$router.push({name:'perfil'})
                  }
              } catch (error) {
                  toast.error('Error al crear el usuario.')
                  console.log(error.message);
                  
              }
          }
      }
  }
  </script>