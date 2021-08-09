<template>
<transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
                <div class="col-xs-12">
                    <div class="placeholder-container"><input size="70" type="text" placeholder=" " 
                    v-model="listdip_group"/><label>Группа</label></div>                 
                    <div class="placeholder-container">
                        <select v-model="selectTeacher" style="color: rgb(85, 85, 85);"> 
                        <option disabled value="">Выберите преподавателя</option>                
                            <option v-for="(teacher, index) in listTeacher" :key="index">
                                <label>{{ teacher.users_name }} </label>                  
                            </option>
                        </select> 
                    </div>
                    <div class="placeholder-container"><input size="70" type="text" placeholder=" " 
                    v-model="listdip_students"/><label>Количество дипломников</label></div>                  
              <div class="modal-footer">
                <slot name="footer">
                  <button class="btn btn-block btn-primary" style="width: 200px;" @click="addPlan()">
                   Добавить
                  </button>
                  <button class="btn btn-block btn-danger" style="width: 200px;" @click="$emit('close')">
                   Отменить
                  </button>
                </slot>
              </div>
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
    listTeacher: {
        type: Array,
        default: function () {
          return {}
        }
    }
  },
  data () {
    return {
        listdip_group: null,
        listdip_teacher_name: null,
        listdip_students: null,
        selectTeacher: ''
    }
  },
  methods: {
    async addPlan () {
        await requestService.addDip({
            listdip_group: this.listdip_group,
            listdip_teacher_name: this.selectTeacher,
            listdip_students: this.listdip_students
        })     
        this.$emit('close')
    }
  }
}
</script>

<style scoped>
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
