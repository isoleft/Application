<template>
<transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
                <div class="col-xs-12">
                    <div class="placeholder-container"><input :style="{'border': borderStyleName}" size="70" type="text" placeholder=" " 
                    v-model="plan_name"/><label>Название плана</label></div>
                    <div class="placeholder-container"><input :style="{'border': borderStyleYear}" size="70" type="text" placeholder=" " 
                    v-model="plan_year"/><label>Учебный год</label></div>
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
                </div>                   
              <div class="modal-footer">
                <slot name="footer">
                  <button class="btn btn-block btn-primary" style="width: 200px;" @click="addPlan()">
                   Добавить план
                  </button>
                  <button class="btn btn-block btn-danger" style="width: 200px;" @click="$emit('close')">
                   Отменить
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition> 
</template>

<script>
import requestService from '@/services/requestsService'

export default {
  name: 'modalAdd',
  props: {
    listPost: {
        type: Array,
        default: function () {
            return {}
        }
    },
    listDegree: {
        type: Array,
        default: function () {
            return {}
        }
    },
    listRank: {
        type: Array,
        default: function () {
            return {}
        }
    }
  },
  data () {
    return {
        plan_name: null,
        plan_year: null,
        listBet: [0.5, 1.0, 1.5],
        selectBet: '',
        selectPost: '',
        selectDegree: '',
        selectRank: '',
        borderStyleName: '2px solid #d9dfe4',
        borderStyleYear: '2px solid #d9dfe4',
    }
  },
  methods: {
    async addPlan () {
        if (!this.plan_name) {
            this.borderStyleYear = '2px solid #d9dfe4'       
            this.borderStyleName = '2px solid ' + '#e30b05'
        } else {
            if (!this.plan_year) {
                this.borderStyleName = '2px solid #d9dfe4'
                this.borderStyleYear = '2px solid ' + '#e30b05'
            } else {
              this.borderStyleYear = '2px solid #d9dfe4'
              this.borderStyleName = '2px solid #d9dfe4'  
              const object = {
                plan_name: this.plan_name,
                plan_year: this.plan_year,
                plan_bet: null,
                post_name: null,
                academicdegree_name: null,
                academicrank_name: null,
              }
              if (this.selectBet != '') {
                object.plan_bet = parseFloat(this.selectBet)
              }
              if (this.selectPost != '') {
                object.post_name = this.selectPost
              }
              if (this.selectDegree != '') {
                object.academicdegree_name = this.selectDegree
              }
              if (this.selectRank != '') {
                object.academicrank_name= this.selectRank
              }
              const response = await requestService.addPlanTeacher(object)
              if (response.data.message == 404) {
                this.$emit('close')
                this.$alert('План на заданный учебный год уже существует!', "Ошибка", "error");           
              } else {
                this.$emit('close')
                this.$alert('План добавлен', "Успешно", "success");
              }
            }
        }
    }
  }
}
</script>

<style scoped>
.sender {
  position: absolute;
  font-family: Century Gothic;
  top: 0;
  margin-left: 600px;
  padding: 10px 20px 10px 30px;
  background-color: rgb(128, 133, 128);
  color: white;
  font-size: 13px;
  width: 318px;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 1000px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
.modal-body {
  margin: 20px 0;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
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
