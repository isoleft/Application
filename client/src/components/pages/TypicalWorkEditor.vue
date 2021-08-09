<template>
	
  <div>
    <div class="left">
    <button style="margin-top: 10px; margin-bottom: 10px;"
        v-for="tab in tabs"
        v-bind:key="tab"
        v-bind:class="['tab-button', { active: currentTab === tab }]"
        v-on:click="currentTab = tab"
      >
        {{ tab }}
      </button>
      <div class="year">
      <select v-model="selectYear">
          <option disabled value="">Выберите учебный год</option> 
            <option
              v-for=" year in listYear" :key="year.eduload_year"
              >{{ year.plan_year }}
            </option>
      </select>
    </div>
    </div>

    <BeeGridTable class="left" v-if="content_typicalwork"
    border
    highlight-row
    ref="table"
    :showPager="false"
    :loading="stateLoading"
    :showFilter="false"
    :columns="columns"
    :data="content_typicalwork"
    width="1452"
    > 

    <template slot-scope="{ row }" slot="checkbox">
        <input type="checkbox" id="checkbox" v-model="row.checked" @click="addTypicalWork(row)">
    </template>

    </BeeGridTable>
  </div>
</template>

<script>
import requestService from '@/services/requestsService'

export default {
  name: "TypicalWorkEditor",
  data () {
    return {
      content_typicalwork: null,
      content_state: null,     
      stateLoading: false,
      currentTab: "Учебно-методическая работа",
      tabs: ["Учебно-методическая работа", "Организационно-методическая работа", "Научно-исследовательская работа", 
        "Воспитательная работа"],
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
            slot: "checkbox",
            key: "checkbox",
            width: 50
          }
      ],
      selectYear: '',
      listYear: [],
      actual_plan: null
    }
  },
  mounted () {
    this.getTypicalContent('all year')
  },
  watch: {
    currentTab: function () {
      this.getTypicalContent(this.selectYear)
    },
    selectYear: function () {
      this.getTypicalContent(this.selectYear)
    }
  },
  methods: {
    async getTypicalContent (year) {
        const response = await requestService.fetchTypicalContent(this.currentTab, year)  
        if (year == 'all year') {
          this.listYear = response.data
          this.selectYear = this.listYear[0].plan_year
        } else {
          this.content_state = response.data.content_state
          this.content_typicalwork = response.data.content
          this.actual_plan = response.data.plan_actual
          if (this.content_state != null) {
            this.contentState(this.content_typicalwork, this.content_state)
          }
        }              
    },
    addTypicalWork (row) { 
        if (row.checked != true) {
            this.$prompt("Выберите количество часов исходя из нормы времени!", '', row.typicalwork_name + '\nНорма времени: ' + row.typicalwork_workload, 'question').then((text) => {
                if (/^[0-9.,]+$/.test(text)) {
                    row.typicalwork_workload = parseFloat(text.replace(/,/, '.'))
                    if (this.actual_plan == 'Одобрен' || this.actual_plan == 'На рассмотрении') {
                      this.$alert('План ' + this.actual_plan,'Ошибка', 'error')
                      this.getTypicalContent(this.selectYear)
                    } else {
                      this.add(row)            
                      this.$alert('Работа добавлена в план','Успешно', 'success')
                    }
                } else {
                    this.$alert('Введите число!','Некорректный ввод', 'error')  
                    this.getTypicalContent(this.selectYear)       
                }
            }).catch(() => {
                this.getTypicalContent(this.selectYear)
            }); 
        } else {
            this.state = this.$confirm("Вы действительно хотите удалить выбранную работу?", "Подтверждение", 'question').then(() => {
                this.delete(row.typicalwork_id, row.tabletype_id)
            }).catch(() => {
                this.getTypicalContent(this.selectYear)         
            });       
        }
    },
    async add (row) {
        await requestService.addTypicalWorkFromPlan(row, this.selectYear)
    },
    async delete (typicalwork_id, tabletype_id) {      
        await requestService.deleteTypicalWork(typicalwork_id, tabletype_id)
    },
    contentState (content, state) {
        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < content.length; j++) {
                if (content[j].typicalwork_id == state[i].typicalwork_id) {
                    content[j].key = 'checked'
                    content[j].checked = true 
                }
            }
        }
    }
  }
}
</script>

<style scoped>
.tab-button {
    padding: 6px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #f0f0f0;
    margin-bottom: -1px;
    margin-right: -1px;
}
.tab-button:hover {
    background: #e0e0e0;
}
.tab-button.active {
    background: #e0e0e0;
}
.tab {
    border: 1px solid #ccc;
    padding: 10px;
}
.left {
    margin-left: 10px;
}
.year {
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
