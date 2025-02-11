<template>
  <section class="">
    <Toaster />
    <h2 class="">Regístrate</h2>
    <p class=""></p>
    <form @submit.prevent="registerUser">
        <input type="email" class="" v-model="email" placeholder="Correo electrónico" required>
        <input type="password" class="" v-model="password" placeholder="Contraseña" required>
        <button type="submit" class="">Registrarse</button>
    </form>
    <p class="">¿Ya tienes cuenta? <router-link class="" to="/login">inicia sesión</router-link></p>
  </section>
</template>

<script>
import {auth} from '@/db/firebase'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import { Toaster, toast } from 'vue-sonner'
export default {
    name:'RegistreView',
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
        async registerUser(){
            try {
                const userCredentials = await createUserWithEmailAndPassword (auth, this.email, this.password)
                const user = userCredentials.user
                console.log(user);
                await sendEmailVerification(user)
                toast.warning('Por favor verifica tu correo electrónico para continuar.')
                //this.$router.push({name:'login'})
                // if (!user.emailVerified){
                // }
            } catch (error) {
                toast.error('Error al crear el usuario.')
                console.log(error.message);
                
            }
        }
    }
}
</script>