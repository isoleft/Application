<template>
<div>
<nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/MainTeacher" class="navbar-brand">NameSystem</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link :to="{ name: 'approvedPlans' }" class="nav-link">Список одобренных инд.планов</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'listDip' }" class="nav-link">Распределение дипломников</router-link>
        </li>      
      </div>
      <div class="navbar-nav" style="margin-right: 36%;">
      <div class="nav-item">
        <img src="@/assets/user2.png" class="nav-link">
      </div>
      <div class="nav-item">
        <p class="nav-link" style="margin-top:5px;">{{user}}</p>
      </div>
      </div>
      <div>
          <img src="@/assets/notification.png" class="nav-link" @click="showModal = true">
      </div>   
      <button class="btn btn-block btn-primary" style="width: 100px; margin-left: 10px;" @click="signOut()">Выйти</button>
</nav>

<modal v-if="showModal" v-bind:messages="messages" @close="showModal = false">
</modal>

<div v-if="listPlans.length != 0" class="list">
  <div class="card mb-3" style="max-width: 700px;" v-for="plan in listPlans" :key="plan.plan_id">
    <div class="row no-gutters">
      <div class="col-md-8">
        <div class="card-body">
          <router-link :to="{ name: 'ContentPlan', params: { id: plan.plan_id }}">
          <h3 class="card-text" style="margin-bottom:10px;">{{ plan.plan_name }}</h3></router-link>
          <h5 class="card-text">{{ plan.plan_year}} учебный год</h5>
          <h5 class="card-text">ФИО: {{ plan.users_name }}</h5>
          <p class="time">{{ plan.plan_date_in }}</p>
          <h5 class="card-text">Должность: {{ postNamefromId(plan.post_id)}}({{ plan.plan_bet }} ставка)</h5>
          <h5 class="card-text">Ученая степень: {{ degreeNamefromId(plan.academicdegree_id)}}</h5>
          <h5 class="card-text">Ученое звание: {{ rankNamefromId(plan.academicrank_id)}}</h5>                   
        </div>
      </div>
    </div>
  </div>
</div>
<div v-else>
  <p class="text-plans">Список планов на одобрение пуст!</p>
</div>
</div>
</template>

<script>
import requestService from '@/services/requestsService'
import session from '@/services/session'
import modal from '@/components/modal'
import modalDip from '@/components/modalDip'

export default {
  name: 'MainManager',
  components: {
    modal,
    modalDip
  },
  data () {
    return {
      listPlans: null,
      listPost: null,
      listDegree: null,
      listRank: null,
      user: null,
      showModal: false,
      messages: null
    }
  },
  mounted() {
    this.getListPlans()
  },
  methods: { 
    async getListPlans () {
      const response = await requestService.fetchListPlansManager() 
      this.user = response.data.user
      this.listPost = response.data.post
      this.listDegree = response.data.degree
      this.listRank = response.data.rank
      this.listPlans = this.parsedPlan(response.data.plans) 
      this.messages = response.data.messages  
    },
    postNamefromId (id) {
      if (id) {
        return this.listPost.filter(e => e.post_id == id)[0].post_name
      } else {
        return 'Не указано'
      }

    },
    degreeNamefromId (id) { 
      if (id != null) {
        return this.listDegree.filter(e => e.academicdegree_id == id)[0].academicdegree_name
      } else {
        return 'Не указано'
      }

    },
    rankNamefromId (id) {
      if (id) {
        return this.listRank.filter(e => e.academicrank_id == id)[0].academicrank_name
      } else {
        return 'Не указано'
      }

    },
    parsedPlan (plan) {
      plan.forEach(element => {
        if (element.plan_name == null) {
          element.plan_name = 'Нет названия'
        }
        if (element.plan_bet == null) {
          element.plan_bet = 'Не указано'
        } else if (element.plan_bet == 1) {
          element.plan_bet = '1.0'
        }
        element.plan_date_in = element.plan_date_in.slice(0,-14) + ' ' + element.plan_date_in.slice(11,-8) 
      })
      return plan
    },
    signOut () {
      this.$confirm("Вы действительно хотите выйти?", "Подтверждение", 'question').then(() => {
        session.deleteToken()
        this.$router.push({ name: 'LoginPage' })
      });
    }
  }
}
</script>

<style scoped>
.list {
  margin-left: 33%; 
  margin-top: 1%
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
.time {
  position: absolute;
  font-family: Century Gothic;
  top: 0;
  margin-left: 498px;
  padding: 10px 30px 10px 30px;
  background-color: darkgreen;
  color: white;
  font-size: 15px;
  width: 180px;
}
</style>
