<template>
  <section>
    <Toaster />
    <form @submit.prevent="saveProfile">
      <div v-if="marcadorPregunta==1">
        <h2>Pregunta 1</h2>
        <p>En una escala d el 1 al 10, ¿qué tan importante es para ti ayudar a los demás?</p>
        <input type="range" min="1" max="10" v-model="respuestas.impAyudar">
        <button @click="marcadorPregunta++">Siguiente</button>
      </div>
      <div v-if="marcadorPregunta==2">
        <h2>Pregunta 2</h2>
        <p>Menciona 3 acciones que hayas realizado recientemente para ayudar a alguien:</p>
        <input type="text" placeholder="Accion 1" v-model="respuestas.accionesRecientes.accion1">
        <input type="text" placeholder="Accion 2" v-model="respuestas.accionesRecientes.accion2">
        <input type="text" placeholder="Accion 3" v-model="respuestas.accionesRecientes.accion3">
        <button @click="marcadorPregunta++">Siguiente</button>
      </div>
      <div v-if="marcadorPregunta==3">
        <h2>Pregunta 3</h2>
        <p>Describe una situación en la que hayas puesto las necesidades de alguien más por encima de las tuyas.</p>
        <input type="text" placeholder="Situación altruista" v-model="respuestas.sitAltru">
        <button @click="marcadorPregunta++">Siguiente</button>
      </div>
      <div v-if="marcadorPregunta==4">
        <h2>Pregunta 4</h2>
        <p>Qué significa para ti ser buena persona.</p>
        <input type="text" placeholder="Siginificado de bondad" v-model="respuestas.sigBon">
        <button @click="marcadorPregunta++">Siguiente</button>
      </div>
      <div v-if="marcadorPregunta==5">
        <h2>Pregunta 5</h2>
        <p>¿Crees que es importante ser honesto incluso cuando es dificil?</p>
        <select v-model="respuestas.honestidad">
          <option value="si">Si</option>
          <option value="no">No</option>
        </select>
        <button type="submit">Finalizar</button>
      </div>
    </form>
  </section>
</template>

<script>
import {auth, db} from "@/db/firebase"
import {doc, setDoc, getDoc} from "firebase/firestore"
import {Toaster, toast} from "vue-sonner"
export default {
  name: 'PreguntasView',
  components:{
    Toaster
  },
  data(){
    return{
      marcadorPregunta: 1,
      respuestas: {
        impAyudar: 1,
        accionesRecientes:{
          accion1: '',
          accion2: '',
          accion3: ''
        },
        sitAltru: '',
        sigBon: '',
        honestidad: ''
      },
      user:{
        user: null
      },
      perfil:{}
    }
  },
  methods:{
    getAccionesRecientes(){
      return this.respuestas.accionesRecientes.accion1 == '' || this.respuestas.accionesRecientes.accion2 == '' || this.respuestas.accionesRecientes.accion3 == ''
    },
    getAltruismo(){
      return this.respuestas.sitAltru.includes("Ayudar") && this.respuestas.sigBon.includes("Ayudar")
    },
    humanometro(){
      let fechaCompleta = new Date()
      let fecha = `${fechaCompleta.getDate()}/${fechaCompleta.getMonth()+1}/${fechaCompleta.getFullYear()}`
      if (this.respuestas.impAyudar >= 7 && !this.getAccionesRecientes() &&  this.getAltruismo() && this.respuestas.honestidad=="si"){
        let diagnostico = {
          diagnostico: 'Eres buena persona',
          fecha: fecha
        }
        this.perfil.diagnosticos.push(diagnostico)
      }else{
        let diagnostico = {
          diagnostico: 'Podrías mejorar en algunos aspectos',
          fecha: fecha
        }
        this.perfil.diagnosticos.push(diagnostico)
      }

    },
    async saveProfile(){
        if(!this.user)return
        try {
          this.humanometro()
          const docRef = doc(db, "humans", this.user.uid)
          console.log(this.perfil)   
          await setDoc(docRef, this.perfil) 
          toast.success('Formulario completado correctamente 😍')
        } catch (error) {
          toast.error('Hubo un problema al guardar el perfil 🤷‍♀️')
        }
    },
    async fetchProfile(){
        if(!this.user)return
        try {
          const docRef = doc(db, "humans", this.user.uid)
          const docSnap = await getDoc(docRef)
          if(docSnap.exists()){
            this.perfil = {...docSnap.data()}
          }else{
            toast.error('No se encontró el perfil 🤷‍♂️')
          }
        } catch (error) {
          toast.error('Error al obtener el perfil 🤷‍♂️')
        }
      },
  },
  mounted(){
    this.user = auth.currentUser
    this.fetchProfile()
    this.marcadorPregunta = 1
  }
}
</script>
