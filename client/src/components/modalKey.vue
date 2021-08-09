<template>
<transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
                <div class="col-xs-12">
                    <div class="placeholder-container"><input :style="{'border': borderStyleName}" size="70" type="text" placeholder=" " 
                    v-model="datatable_name"/><label>Вид работы</label></div>
                    <div v-if="currentTab != 'Повышение квалификации'" class="placeholder-container"><input :style="{'border': borderStyleWorkload}" size="70" type="text" placeholder=" " 
                    v-model="datatable_workload"/><label>Объем работы, час</label></div>    
                    <div class="placeholder-container"><input size="70" type="text" placeholder=" " 
                    v-model="datatable_deadline"/><label>Срок выполнения</label></div>       
                </div>                   
              <div class="modal-footer">
                <slot name="footer">
                  <button class="btn btn-block btn-primary" style="width: 200px;" @click="addPlan()">
                   Добавить работу
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
  name: 'modalKey',
  props: {
    year: {
      type: String
    },
    currentTab: {
      type: String
    }
  },
  data () {
    return {
        datatable_name: null,
        datatable_workload: null,
        datatable_deadline: null,
        borderStyleName: '2px solid #d9dfe4',
        borderStyleWorkload: '2px solid #d9dfe4',
        listType: [
            {tabletype_id: 1, tabletype_name: 'Учебно-методическая работа'},
            {tabletype_id: 2, tabletype_name: 'Организационно-методическая работа'},
            {tabletype_id: 3, tabletype_name: 'Научно-исследовательская работа'},
            {tabletype_id: 4, tabletype_name: 'Воспитательная работа'},
            {tabletype_id: 5, tabletype_name: 'Повышение квалификации'}
            ]
    }
  },
  methods: {
    addPlan () {     
        if (!this.datatable_name) {
            this.borderStyleWorkload = '2px solid #d9dfe4'       
            this.borderStyleName = '2px solid ' + '#e30b05'
        } else {
          if (this.currentTab == 'Повышение квалификации') {
            const object = {
              typicalwork_name: this.datatable_name,
              typicalwork_workload: null,
              deadline: this.datatable_deadline,
              typicalwork_id: null,
              tabletype_id: this.listType.filter(e => e.tabletype_name == this.currentTab)[0].tabletype_id
            }  
            this.add(object)
          } else {
            if (!this.datatable_workload) {
              this.borderStyleName = '2px solid #d9dfe4'
              this.borderStyleWorkload = '2px solid ' + '#e30b05'
            } else {
              this.borderStyleWorkload = '2px solid #d9dfe4'
              this.borderStyleName = '2px solid #d9dfe4'
              const object = {
                typicalwork_name: this.datatable_name,
                typicalwork_workload: this.datatable_workload,
                deadline: this.datatable_deadline,
                typicalwork_id: null,
                tabletype_id: this.listType.filter(e => e.tabletype_name == this.currentTab)[0].tabletype_id
              }         
              this.add(object)                    
            }
          }
            setTimeout(() => (this.$emit('close')), 500)
            setTimeout(() => (this.$alert('Работа добавлена', "Успешно", "success")  ), 500)
        }
    },
    async add (object) {
        await requestService.addTypicalWorkFromPlan(object, this.year)
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
