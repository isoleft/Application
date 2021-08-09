<template>
<transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
                <BeeGridTable
                    border
                    highlight-row
                    ref="table"
                    :showPager="false"                   
                    :showFilter="false"
                    :columns="columns"
                    :data="listTypicalWork"                   
                    > 

                    <template slot-scope="{ row }" slot="add">
                      <img src="@/assets/plus1.png" @click="show = true, temp = row">
                    </template>

                </BeeGridTable>           
              <div class="modal-footer">
                <slot name="footer">
                  <button class="btn btn-block btn-primary" style="width: 200px;" @click="$emit('close')">
                    закрыть
                  </button>
                </slot>
              </div>
              <modalHours v-if="show" v-bind:typicalwork_name="temp.typicalwork_name" v-bind:typicalwork_workload="temp.typicalwork_workload" @close="addTypicalWork($event)"></modalHours>
            </div>
          </div>
        </div>
      </transition> 
</template>

<script>
import requestService from '@/services/requestsService'
import modalHours from '@/components/modalHours'

export default {
  name: 'modalWork',
  components: {
    modalHours
  },
  props: {
    plan_id: {
      type: String
    },
    currentTab: {
      type: String
    }
  },
  data () {
    return {
        columns: [
          {
            title: "Вид работы",
            key: "typicalwork_name",
            align: "center",
            width: 650
          },
          {
            title: "Норма времени",
            key: "typicalwork_workload",
            align: "center",
            width: 250
          },
          {
            title: "Примечание",
            key: "typicalwork_comment",
            align: "center",
            width: 500
          },
          {
            title: " ",
            slot: "add",
            key: "add",
            width: 70
          }
      ],
      listTypicalWork: null,
      year: null,
      show: false,
      temp: null
    }
  },
  mounted () {
    this.getContent()
  },
  methods: {
    async getContent () {
      const response  = await requestService.fetchPlanContent(this.plan_id, this.currentTab)
      this.listTypicalWork = response.data.listTypicalWork
      this.year = response.data.year
    },
    addTypicalWork (object) {
      this.show = false
      const obj = {
        typicalwork_name: this.temp.typicalwork_name,
        typicalwork_workload: object.hours,
        deadline: object.deadline,
        typicalwork_id: this.temp.typicalwork_id,
        tabletype_id: this.temp.tabletype_id
      } 
      this.add(obj)
  },
  async add (row) {
    await requestService.addTypicalWorkFromPlan(row, this.year)
    this.getContent()
  },
}
}
</script>

<style scoped>
.modal-mask {
  position: absolute;
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
  width: 1532px;
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
</style>
