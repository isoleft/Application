<template>
<div>
<nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link  to="MainSecretary" class="navbar-brand">NameSystem</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link :to= "{ name: 'WorkloadEditor' }" class="nav-link">Редактор нагрузки кафедры</router-link>
        </li>
      </div>
      <div class="navbar-nav" style="margin-right: 36%">
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
      <button class="btn btn-block btn-primary" style="width: 100px;" @click="signOut()">Выйти</button>
</nav>

<modal v-if="showModal" v-bind:messages="messages" @close="showModal = false">
</modal>

  <div class="select_year">
  <select v-model="selectYear">
      <option disabled value="">Выберите учебный год</option> 
        <option
           v-for=" year in listYear" :key="year.eduload_year"
          >{{ year }}
        </option>
  </select>
  </div>
<div v-if="listPlans" class="list">
  <div class="card mb-3" style="max-width: 700px;" v-for="plan in listPlans" :key="plan.plan_id">
    <div class="row no-gutters">
      <div class="col-md-8">
        <div class="card-body">
          <router-link :to="{ name: 'ContentPlan', params: { id: plan.plan_id, info: { plan_year: plan.plan_year, plan_post: postNamefromId(plan.post_id), plan_bet: plan.plan_bet, plan_name: plan.users_name}}}">
          <h3 class="card-text" style="margin-bottom:10px;">{{ plan.plan_name }}</h3></router-link>
          <h5 class="card-text">{{ plan.plan_year}} учебный год</h5>
          <h5 class="card-text">ФИО: {{ plan.users_name }}</h5>
          <p class="time">{{ plan.plan_date_in }}</p>
          <h5 class="card-text">Должность: {{ postNamefromId(plan.post_id)}}({{ plan.plan_bet }} ставка)</h5>
          <h5 class="card-text">Ученая степень: {{ degreeNamefromId(plan.academicdegree_id)}}</h5>
          <h5 class="card-text">Ученое звание: {{ rankNamefromId(plan.academicrank_id)}}</h5>
          <p class="statePlan">{{ plan.plan_actual }}</p>                  
        </div>
      </div>
    </div>
  <div class="button-navigation">                          
    <router-link :to="{ name: 'EditPlan', params: { id: plan.plan_id }}"><img src="@/assets/edit.png"></router-link>
  </div>
  </div>
</div>
<div v-else>
  <p class="text-plans">Индивидуальные планы отсутствуют</p>
</div>
</div>
</template>

<script>
import requestService from '@/services/requestsService'
import session from '@/services/session'
import modal from '@/components/modal'

export default {
  name: 'MainSecretary',
  components: {
    modal
  },
  data () {
    return {
      listPlans: null,
      listPost: null,
      listDegree: null,
      listRank: null,
      user: null,
      selectYear: '',
      listYear: [],
      showModal: false,
      messages: null
    }
  },
  mounted() {
    this.getListPlans('all year')
  },
  watch: {
    selectYear: function () {
      this.getListPlans(this.selectYear)
    }
  },
  methods: { 
    async getListPlans (year) {
      const response = await requestService.fetchListPlans(year)
      if (year == 'all year') {
        this.parsedyear(response.data)   
        this.selectYear = this.listYear[0]
      } else {
        this.user = response.data.user
        this.listPost = response.data.post
        this.listDegree = response.data.degree
        this.listRank = response.data.rank
        this.listPlans = this.parsedPlan(response.data.plans)
        this.messages = response.data.messages
      }    
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
    parsedyear (listyear) {
      this.listYear.push('Все доступные года')
      for (let i = 0; i < listyear.length; i++) {
        this.listYear.push(listyear[i].plan_year)
      }
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
.statePlan {
  position: absolute;
  font-family: Century Gothic;
  top: 45px;
  margin-left: 468px;
  padding: 10px 30px 10px 30px;
  background-color: rgb(14, 6, 134);
  color: white;
  font-size: 15px;
  width: 210px;
}
.button-navigation {
  position: absolute;
  left: 650px;
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
.select_year {
  margin-left: 10px;
  margin-top: 10px;
}

</style>
