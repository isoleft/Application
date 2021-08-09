<template>
  <div class="container" style="  margin-left: 40%;">
    <div class="row">
        <div class="col-xs-12">
            <h1 class="hh">Редактирование информации о плане</h1>
            <form>
                <div class="placeholder-container"><input size="70" type="text" placeholder=" " 
                v-model="plan.plan_name" /><label>Название плана</label></div>
                <div class="placeholder-container">
                <select v-model="selectBet" style="color: rgb(85, 85, 85);"> 
                <option disabled value="">Выберите ставку</option>                
                    <option v-for="(bet, index) in listBet" :key="index">
                        <label>{{ bet }} </label>                  
                    </option>
                </select> 
                </div>
                <div class="placeholder-container">
                <select v-model="selectPost" style="color: rgb(85, 85, 85);"> 
                <option disabled value="">Выберите должность</option>                
                    <option v-for="(post, index) in listPost" :key="index">
                        <label>{{ post.post_name }} </label>                  
                    </option>
                </select> 
                </div>
                <div class="placeholder-container">
                <select v-model="selectDegree" style="color: rgb(85, 85, 85);"> 
                <option disabled value="">Выберите учебную степень</option>                
                    <option v-for="(degree, index) in listDegree" :key="index">
                        <label>{{ degree.academicdegree_name }} </label>                  
                    </option>
                </select> 
                </div>  
                <div class="placeholder-container">
                <select v-model="selectRank" style="color: rgb(85, 85, 85);"> 
                <option disabled value="">Выберите ученое звание</option>                
                    <option v-for="(rank, index) in listRank" :key="index">
                        <label>{{ rank.academicrank_name }} </label>                  
                    </option>
                </select> 
                </div>                            
                <div class="form-group"><button class="btn btn-block btn-primary" type="button" name="addPlan" id="addPlan" @click="updatePlan()">Применить изменения</button></div>
                <section><button class="btn btn-success btn-block" type="button" @click="goBack()">Вернуться к списку</button></section>
            </form>
        </div>   
    </div>
</div>
</template>

<script>
import requestService from '@/services/requestsService'

export default {
  name: 'EditPlan',
  data () {
    return { 
      plan: [],     
      listPost: null,
      listDegree: null,
      listRank: null,
      listBet: [0.5, 1.0, 1.5],
      selectPost: '',
      selectDegree: '',
      selectRank: '',
      selectBet: '',
      access_id: null,
      selectPath: ['MainSecretary', 'MainTeacher']
    }
  },
  mounted () {
    this.getPlan()
  },
  methods: {
    async getPlan () {
      const response = await requestService.fetchInfoPlan({ id: this.$route.params.id })
      this.plan = response.data.plan
      this.listPost = response.data.post
      this.listDegree = response.data.degree
      this.listRank = response.data.rank
      this.access_id = response.data.access_id
      this.getSelect()
    },
    async updatePlan () {
      let post = null
      let degree = null
      let rank = null
      if (!this.selectPost) {
        post = null
      } else {
        post = this.listPost.filter(e => e.post_name == this.selectPost)[0].post_id
      }
      if (!this.selectDegree) {
        degree = null
      } else {
        degree = this.listDegree.filter(e => e.academicdegree_name == this.selectDegree)[0].academicdegree_id
      }
      if (!this.selectRank) {
        rank = null
      } else {
        rank = this.listRank.filter(e => e.academicrank_name == this.selectRank)[0].academicrank_id
      }
      const object = {
        plan_name: this.plan.plan_name,
        plan_bet: parseFloat(this.selectBet),
        post_id: post,
        academicdegree_id: degree,
        academicrank_id: rank
      }

      await requestService.updateInfoPlan(this.$route.params.id, object)
      this.goBack()
    },
    getSelect () {
      if (this.plan.plan_bet != null) {
        this.selectBet = this.plan.plan_bet
      }
      if (this.plan.post_id != null) {
        this.selectPost = this.listPost.filter(e => e.post_id == this.plan.post_id)[0].post_name
      }
      if (this.plan.academicdegree_id != null) {
        this.selectDegree = this.listDegree.filter(e => e.academicdegree_id == this.plan.academicdegree_id)[0].academicdegree_name
      }
      if (this.plan.academicrank_id != null) {
        this.selectRank = this.listRank.filter(e => e.academicrank_id == this.plan.academicrank_id)[0].academicrank_name
      }
    },
    goBack () {   
      this.$router.push({ name: this.selectPath[this.access_id] })
    }  
  }
}
</script>

<style scoped>
.hh {
  font-size: 20pt;
  font-family: Century Gothic;
  text-align: center;
  color: rgb(163, 161, 165);
  margin-top: 20px;
  margin-bottom: 25px;
}
.placeholder-container {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
}
.placeholder-container input {
    background-color: #FFF;
    border: 2px solid #d9dfe4;
    box-sizing: border-box;
    color: #000;
    font-size: 16px;
    line-height: 16px;  
    height: 50px;
    outline: 0;
    padding: 0 20px;
    width: 100%;
}
.placeholder-container select {
    background-color: #FFF;
    border: 2px solid #d9dfe4;
    box-sizing: border-box;
    color: #000;
    font-size: 16px;
    line-height: 16px;  
    height: 50px;
    outline: 0;
    padding: 0 20px;
    width: 100%;
}
.placeholder-container label {
    color: rgb(85, 85, 85);
    font-family: Century Gothic;   
    background-color: #FFF;
    font-size: 16px;
    line-height: 16px;
    padding: 5px 10px;
    pointer-events: none;
    position: absolute;
    transition: all 200ms;
    top: 12px;
    left: 10px;
    background-color: #FFF;
}
.placeholder-container input:focus + label,
.placeholder-container input:not(:placeholder-shown) + label{
    top: -10px;
    left: 10px;
    font-size: 17px; 
    background-color: #BFE2FF;
    padding: 2px 10px;
}
</style>

