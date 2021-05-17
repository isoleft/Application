<template>
<div>
<div v-if="check">
  <p class="text-plans">Учебные работы отсутствуют!</p>
</div>
<div style="margin-top: 50px; margin-left: 650px;">
  <div class="card mb-3" style="max-width: 700px;" v-for="plan in plans" :key="plan.id">
    <div class="row no-gutters">
      <div class="col-md-8">
        <div class="card-body">
          <router-link :to="{ name: 'EduWorkContent', params: { id: plan.id }}"><h3 class="card-text" style="margin-bottom:10px;">{{ plan.name }}</h3></router-link>
          <h5 class="card-text">Семестр: {{ plan.semestr}}</h5>
          <h5 class="card-text">Преподаватель: {{ plan.teacher }}</h5>
          <p v-if="plan.state == 'актуально'" class="state1">{{ plan.state }}</p> 
          <p v-else class="state2">{{ plan.state }}</p>          
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  name: 'EduWork',
  data () {
    return {
      plans: [],     
      check: true,
      userAuth: null
    }
  },
  mounted() {  
    if(localStorage.getItem('plans')) {
      try {
        this.plans = JSON.parse(localStorage.getItem('plans'))     
        this.userAuth = sessionStorage.getItem('userAuth')
        this.plans = this.plans.filter(item => item.teacher == this.userAuth && (item.state == 'актуально' || item.state == 'доработка'))
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

  }
}
</script>

<style scoped>
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
  margin-left: 542px;
  padding: 10px 30px 10px 30px;
  background-color: darkgreen;
  color: white;
  font-size: 15px;
}
.state2 {
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
