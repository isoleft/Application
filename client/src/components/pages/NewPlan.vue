<template>
    <div class="container" style="margin-left: 700px;">
    <div class="row">
        <div class="col-xs-12">
            <h1 class="hh">Добавление новой учебной работы</h1>
            <form>
                <div class="placeholder-container"><input size="70" type="text" name="Name" id="Name" placeholder=" " v-model.trim="newName" />
                <label>Название</label></div>
                <div class="placeholder-container"><input size="70" type="text" name="Semestr" id="Semestr" placeholder=" " v-model.trim="newSemestr" />
                <label>Семестр</label></div>
                <div class="form-group" style="margin-bottom: 15px; font-family: Century Gothic;">
                <select class="form-control" v-model="newTeacher">                 
                    <option v-for="(teacher, index) in teachers" :key="index">
                        {{teacher}}
                    </option>
                </select> 
                </div>                           
                <div class="form-group"><button class="btn btn-block btn-primary" type="button" name="addPlan" id="addPlan" @click="addPlan()">Добавить учебную работу</button></div>
                <section><button class="btn btn-success btn-block" type="button" @click="goBack()">Вернуться к списку</button></section>
            </form>
        </div>   
    </div>
</div>
</template>

<script>
export default {
  name: 'NewPlan',
  data () {
    return {
        plans: [],     
        teachers: [ 'Алексеев В.А.', 'Ведищев В.В.', 'Домашнев П.А.', 'Гаев Л.В.', 'Назаркин О.А.', 'Болдырихин О.В.'],
        newName: null,
        newSemestr: null,
        id: null,
        newTeacher: 'Алексеев В.А.',
        state: 'разработка'        
    }
  },
  mounted () {
    if(localStorage.getItem('plans')) {
      try {
        this.plans = JSON.parse(localStorage.getItem('plans'))
      } catch(e) {
        localStorage.removeItem('plans')
      }
    }
  },
  methods: {
    addPlan () {
        if(!this.newName || !this.newSemestr) {
            this.$alert("Заполните всю информацию!", "Предупреждение", "warning");
        } else {
        this.id = this.generateId()
        var obj = { id: this.id, name: this.newName, semestr: this.newSemestr, teacher: this.newTeacher, state: this.state }
        this.plans.push(obj)
        this.savePlan()
        this.$router.push({ name: 'Plans' })
        }
    },
    savePlan () {
        let parsed = JSON.stringify(this.plans)
        localStorage.setItem('plans', parsed)
    },
    goBack () {
        this.$router.push({ name: 'Plans' })
    },
    generateId () {
      return '_' + Math.random().toString(36).substr(2, 9)
    }  
  }
}
</script>

<style scoped>
.hh {
  font-size: 25pt;
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

