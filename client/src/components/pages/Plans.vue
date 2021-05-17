<template>
<div>
<nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">NameSystem</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/tutorials" class="nav-link">Загрузить нагрузку</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/NewPlan" class="nav-link">Добавить учебную работу</router-link>
        </li>
      </div>
</nav>
<div v-if="check">
  <p class="text-plans">Учебные работы отсутствуют. Добавьте первую учебную работу прямо сейчас!</p>
</div>
<div style="margin-top: 50px; margin-left: 650px;">
  <div class="card mb-3" style="max-width: 700px;" v-for="plan in plans" :key="plan.id">
    <div class="row no-gutters">
      <div class="col-md-8">
        <div class="card-body">
          <router-link :to="{ name: 'ContentPlan', params: { id: plan.id }}"><h3 class="card-text" style="margin-bottom:10px;">{{ plan.name }}</h3></router-link>
          <h5 class="card-text">Семестр: {{ plan.semestr}}</h5>
          <h5 class="card-text">Преподаватель: {{ plan.teacher }}</h5>
          <p v-if="plan.state == 'разработка'" class="state1">{{ plan.state }}</p>
          <p v-else-if="plan.state == 'актуально'" class="state2">{{ plan.state }}</p>  
          <p v-else class="state3">{{ plan.state }}</p>                 
        </div>
      </div>
    </div>
  <div class="button-navigation">                          
    <router-link :to="{ name: 'EditPlan', params: { id: plan.id }}"><img src="@/assets/edit.png"></router-link>
    <img src="@/assets/delete.png" @click="removePlan(plan.id)">
  </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  name: 'Plans',
  data () {
    return {
      plans: [],     
      check: true
    }
  },
  mounted() {
    if(localStorage.getItem('plans')) {
      try {
        this.plans = JSON.parse(localStorage.getItem('plans'))     
      } catch(e) {
        localStorage.removeItem('plans')
      }
    }
  },
  watch: {
    plans() {
      if (this.plans.length == 0) {
        this.check = true
      } else {
        this.check = false
      }
    }
  },
  methods: {    
    removePlan (value) {
      this.$confirm("Вы точно хотите удалить выбранную учебную работу?", "Подтверждение действия", "info").then(() => {
        this.plans.splice(this.plans.findIndex(item => item.id == value) , 1)
        this.savePlans()
      });   
    },
    savePlans () {   
      let parsed = JSON.stringify(this.plans)
      localStorage.setItem('plans', parsed)
    }
  }
}
</script>

<style scoped>
.button-navigation {
  position: absolute;
  left: 600px;
  bottom: 20px;
}
.text-plans {
  font-family: Century Gothic;
  text-align: center;
  position: absolute;
  margin: 0;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: rgb(163, 161, 165);
}
.state1 {
  position: absolute;
  font-family: Century Gothic;
  top: 0;
  margin-left: 528px;
  padding: 10px 30px 10px 30px;
  background-color: rgb(36, 15, 153);
  color: white;
  font-size: 15px;
}
.state2 {
  position: absolute;
  font-family: Century Gothic;
  top: 0;
  margin-left: 542px;
  padding: 10px 30px 10px 30px;
  background-color: darkgreen;
  color: white;
  font-size: 15px;
}
.state3 {
    position: absolute;
    font-family: Century Gothic;
    top: 0;
    margin-left: 535px;
    padding: 10px 30px 10px 30px;
    background-color: rgb(177, 15, 15);
    color: white;
    font-size: 15px;
}
</style>
