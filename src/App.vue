<template>
  <router-view/>
</template>
<script>
import {auth} from "@/db/firebase"
export default{
  mounted(){
    auth.onAuthStateChanged( (user) =>{
      if (user){
        const rutaActual = this.$route.name
        if(rutaActual === "preguntas"){
          this.$router.push({name: 'preguntas'})
        }else if(rutaActual === "perfil"){
          this.$router.push({name: 'perfil'})
        }else{
          this.$router.push({name: 'perfil'})
        }
      }else{
        this.$router.push({name:"login"})
      }
    })
  }
}
</script>