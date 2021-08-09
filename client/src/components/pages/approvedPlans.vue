<template>
<div>

<div class="select_year">
  <select v-model="selectYear">
      <option disabled value="">Выберите учебный год</option> 
        <option
           v-for=" year in listYear" :key="year.eduload_year"
          >{{ year }}
        </option>
  </select>
</div>
<div v-if="showPlans == true" class="list">
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
          <p class="statePlan">{{ plan.plan_actual }}</p>                  
        </div>
      </div>
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

export default {
  name: 'approvedPlans',
  data () {
    return {
      listPlans: null,
      listPost: null,
      listDegree: null,
      listRank: null,
      selectYear: '',
      listYear: [],
      showPlans: false
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
      const response = await requestService.fetchListApprovedPlans(year)
      if (response.data.status == 404) {
        this.showPlans = false
      } else {
        this.showPlans = true
        if (year == 'all year') {
          this.parsedyear(response.data)   
          this.selectYear = this.listYear[0]
        } else {            
          this.listPost = response.data.post
          this.listDegree = response.data.degree
          this.listRank = response.data.rank
          this.listPlans = this.parsedPlan(response.data.plans)             
        }
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
  margin-top: 1%;
}
.addButton {
  height: 60px;
  display:block;
  position: relative;
  margin:0 auto;
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
.select_year {
  margin-left: 10px;
  margin-top: 10px;
}
</style>
