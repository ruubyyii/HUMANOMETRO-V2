<template>
  <section>
    <Toaster />
    <h2>Hola ✌</h2>
    <p>{{perfil.fullName}}</p>
    <p><span>{{ perfil.age }}</span> | <span>{{perfil.gender}}</span></p>
    <button @click="showForm">Modificar datos</button>
    <div v-if="mostrarForm">
          <form @submit.prevent="saveProfile">
            <input type="text" v-model="perfil.fullName" placeholder="Modificar nombre">
          <input type="number" v-model="perfil.age" placeholder="Modificar edad">
          <select v-model="perfil.gender">
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
          <button type="submit">Actualizar perfil</button>
          </form>
      </div>
    <h4>Tu humanómetro:</h4>
    <div class="">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Diagnóstico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>04/02/2025</td>
            <td>Eres buena persona</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import {auth, db} from "@/db/firebase"
// import {signOut} from "firebase/auth"
import {doc, getDoc, setDoc} from "firebase/firestore"
import {Toaster, toast} from "vue-sonner"
export default {
    name: 'PerfilView',
    components:{
      Toaster
    },
    data(){
      return{
        user:{
          user:null
        },
        perfil:{
          fullName: "Sin asignar nombre",
          age: 0,
          gender: "Sin asignar genero",
          diagnosticos:[]
        },
        mostrarForm: false
      }
    },
    methods:{
      async fetchProfile(){
        if(!this.user)return
        try {
          const docRef = doc(db, "humans", this.user.uid)
          const docSnap = await getDoc(docRef)
          if(docSnap.exists()){
            this.perfil = {...docSnap.data()}
            console.log(this.perfil);
          }else{
            toast.error('No se encontró el perfil 🤷‍♂️')
          }
        } catch (error) {
          toast.error('Error al obtener el perfil 🤷‍♂️')
        }
      },
      async saveProfile(){
        if(!this.user)return
        try {
          const docRef = doc(db, "humans", this.user.uid)
          await setDoc(docRef, this.perfil)
          toast.success('Prefil guardado correctamente 😍')
        } catch (error) {
          toast.error('Hubo un problema al guardar el perfil 🤷‍♀️')
        }
      },
      showForm(){
        this.mostrarForm = !this.mostrarForm
      }
    },
    mounted(){
      this.user = auth.currentUser
      this.fetchProfile()
    }
}
</script>

<style>

</style>