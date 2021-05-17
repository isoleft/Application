<template>
<div>
<nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">NameSystem</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'EduWork' }">Учебные работы</router-link>
        </li>     
      </div>
      <router-link :to="{ name: 'userMessage'}"><img src="@/assets/message.png"></router-link>
      <router-link  class="nav-link" :to="{ name: 'userInfo'}"><img src="@/assets/user2.png"></router-link>
      <span class="navbar-text">{{ userAuth }}</span>
      <button v-if="seenLogin" class="btn btn-block btn-success" style="width: 100px; margin-left: 10px;" @click="Login()">Войти</button>
      <button v-if="seenExit" class="btn btn-block btn-primary" style="width: 100px; margin-left: 10px;" @click="Exit()">Выйти</button>
</nav>
</div>
</template>

<script>
export default {
  name: 'MainTeacher',
  data () {
    return {
      userAuth: null,
      seenLogin: null,
      seenExit: null
    }
  },
  mounted () { 
    if(sessionStorage.length == 0) {
      this.seenLogin = true
      this.seenExit = false
    } else {
      this.userAuth = sessionStorage.getItem('userAuth')
      this.seenLogin = false
      this.seenExit = true
      console.log(this.userAuth)
    }    
  },
  methods: {
    Exit() {
      this.$confirm("Вы точно хотите выйти?", "Подтверждение действия", "info").then(() => {
        sessionStorage.clear()
        this.$router.push({ name: 'LoginPage'})   
      }); 
    },
    Login () {
      this.$router.push({ name: 'LoginPage'})
    }
  }
}
</script>

<style scoped>
</style>
