<template>	
  <div>
    <input-excel @getResult="getMyExcelData"></input-excel>
    <button v-if="stateSave" class="btn btn-success btn-block" style="width: 200px; margin-left: 250px; margin-bottom: 10px; margin-top: -48px;" @click="Save()">Сохранить</button>
    <div v-else-if="!stateSave && content_eduLoad">
    <button class="btn btn-danger btn-block" style="width: 250px; margin-left: 250px; margin-bottom: 10px; margin-top: -48px;" @click="deleteEduWork()">Удалить распределение</button>
    <button class="btn btn-success btn-block" style="width: 250px; margin-left: 550px; margin-bottom: 10px; margin-top: -48px;" @click="saveEdit()">Сохранить изменения</button>
    </div>
    <div v-if="listYear" class="selectYear">
    <select v-model="selectYear">
      <option disabled value="">Выберите учебный год</option> 
        <option
          v-for=" year in listYear" :key="year.eduload_year"
          >{{ year.eduload_year }}
        </option>
    </select>
    </div>
    <div v-if="text_display">
      <p class="text-display">Учебная нагрузка еще не загружена!</p>
    </div>
    <BeeGridTable v-if="content_eduLoad"
    border
    highlight-row
    ref="table"
    :showPager="false"
    :loading="stateLoading"
    :showFilter="false"
    :columns="columns"
    :data="content_eduLoad"
    > 
    <template v-if="flag && row.eduload_code != 1601080" slot-scope="{ row }" slot="teacher_lec">
        <select v-model="row.teacher_lec" style="width: 100px">
          <option disabled value="">Выберите преподавателя</option> 
          <option
            v-for=" teacher in listTeacher" :key="teacher"
            >{{ teacher }}
          </option>
        </select>    
    </template>

    <template v-if="flag && row.eduload_code != 1601093 && row.eduload_code != 1601092 && row.eduload_code != 1601091 && row.eduload_code != 1601080" slot-scope="{ row }" slot="teacher_prac">
        <select v-model="row.teacher_prac" style="width: 100px">
          <option disabled value="">Выберите преподавателя</option> 
          <option
            v-for=" teacher in listTeacher" :key="teacher"
            >{{ teacher }}
          </option>
        </select>    
    </template>
    <template v-if="flag && row.eduload_code != 1601093 && row.eduload_code != 1601092 && row.eduload_code != 1601091 && row.eduload_code != 1601080" slot-scope="{ row }" slot="teacher_lab">
        <select v-model="row.teacher_lab" style="width: 100px">
          <option disabled value="">Выберите преподавателя</option> 
          <option
            v-for=" teacher in listTeacher" :key="teacher"
            >{{ teacher }}
          </option>
        </select>    
    </template>
    <template v-if="flag && row.eduload_code != 1601093 && row.eduload_code != 1601092 && row.eduload_code != 1601091 && row.eduload_code != 1601080" slot-scope="{ row }" slot="teacher_idz">
        <select v-model="row.teacher_idz" style="width: 100px">
          <option disabled value="">Выберите преподавателя</option> 
          <option
            v-for=" teacher in listTeacher" :key="teacher"
            >{{ teacher }}
          </option>
        </select>    
    </template>
           
    </BeeGridTable>
  </div>
</template>

<script>

import inputExcel from '@/components/inputExcel'
import requestService from '@/services/requestsService'

export default {
  name: "WorkloadEditor",
  components: {
    inputExcel
  },
  data () {
    return {
      content_eduLoad: null,
      eduLoad_year: null,
      columns: [
        {
          title: "Фор.об.",
          key: "eduload_form",
          align: "center",
          width: 75,        
        },
        {
          title: "Шифр",
          key: "eduload_code",
          align: "center",
          width: 90,            
        },
        {
          title: "Дисциплина",
          key: "eduload_name",
          align: "center",
          width: 300,
          resizable: true,
          sortable: true
        },
        {
          title: "Вид",
          key: "eduload_type",
          align: "center",
          width: 60
        },
        {
          title: "Группа",
          key: "eduload_group",
          align: "center",
          width: 130,
          resizable: true, 
          sortable: true
        },
        {
          title: "Кол.студ",
          key: "eduload_students",
          align: "center",
          width: 90,
        },
        {
          title: "Семестр",
          key: "eduload_semestr",
          align: "center",
          width: 100,
          sortable: true
        },
        {
          title: "Нагрузка",     
          align: "center",
          children: [
            {
              title: "Лек",
              key: "eduload_lec",
              align: "center",
              width: 60,
            },
            {
              title: "ЛР",
              key: "eduload_lab",
              align: "center",
              width: 60,
            },
            {
              title: "ПР",
              key: "eduload_pr",
              align: "center",
              width: 60,
            },
            {
              title: "Экз",
              key: "eduload_ekz",
              align: "center",
              width: 60,
            },
            {
              title: "Зач",
              key: "eduload_zach",
              align: "center",
              width: 60,
            },
            {
              title: "СРС",
              key: "eduload_srs",
              align: "center",
              width: 60,
            },
            {
              title: "Прак",
              key: "eduload_prac",
              align: "center",
              width: 70,
            },
            {
              title: "Дип",
              key: "eduload_dip",
              align: "center",
              width: 60,
            },
            {
              title: "ГАК",
              key: "eduload_gak",
              align: "center",
              width: 60,
            },
            {
              title: "Сумма",
              key: "eduload_sum",
              align: "center",
              width: 90,
            }
          ]
        },
        {
          title: "ИДЗ",
          key: "eduload_idz",
          align: "center",
          width: 70,
        },
        {
          title: "Поток лек.",
          key: "eduload_plec",
          align: "center",
          width: 100,
        },
        {
          title: "Поток прак.",
          key: "eduload_ppr",
          align: "center",
          width: 110,
        },
        {
          title: "Лек.",
          slot: "teacher_lec",
          key: "teacher_lec",
          width: 150,
          align: 'center'
        },
        {
          title: "Прак.",
          slot: "teacher_prac",
          key: "teacher_prac",
          width: 150,
          align: 'center'
        },
        {
          title: "Лаб.",
          slot: "teacher_lab",
          key: "teacher_lab",
          width: 150,
          align: 'center'
        },
        {
          title: "Идз",
          slot: "teacher_idz",
          key: "teacher_idz",
          width: 150,
          align: 'center'
        }
      ],
      stateLoading: false,
      stateSave: false,
      text_display: false,
      selectUsers: null,
      users: null,
      listTeacher: [],
      state: null,
      flag: false,
      listYear: null,
      selectYear: ''
    }
  },
  mounted () {
    this.getContent('all year')
  },
  watch: {
    selectYear: function() {
      this.getContent(this.selectYear)
    }
  },
  methods: {
    async getContent (year) {
      const response = await requestService.fetchContent(year)
      if (year == 'all year') {
        if (response.data.status == 404) {
          this.text_display = true
        } else {
          this.listYear = response.data
          this.selectYear = this.listYear[0].eduload_year
        }
      } else {
        this.text_display = false
        this.stateLoading = true
        this.content_eduLoad = response.data.content
        this.users = response.data.users
        this.state = response.data.state    
        this.contentState(this.content_eduLoad, this.state)
        this.listTeacher = this.getParsedList(this.users)
        this.flag = true   
        setTimeout(() => this.stateLoading = false, 2500)      
      } 
    }, 	
    getMyExcelData(data) {
      this.flag = false
      this.stateLoading = true
      this.content_eduLoad = data
      this.eduLoad_year = this.content_eduLoad[0].eduload_form
      this.content_eduLoad = this.content_eduLoad.filter(e => e.eduload_code != null)
      this.content_eduLoad.splice(0,1)
      setTimeout(() => (this.stateLoading = false, this.stateSave = true), 2500)
    },
    async Save() {
      const checkYear = await requestService.fetchContent(this.eduLoad_year)
      this.stateSave = false
      this.flag = true 
      if (checkYear.data.status == 404) {
        this.add(false)
        this.getContent('all year')
      } else {
        this.$confirm("Учебная нагрузка кафедры данного учебного года уже была загружена! При сохранении новой учебной нагрузки распределение удалится!", "Подтверждение", 'question').then(() => {
          this.add(true)
          this.getContent(this.selectYear) 
        }).catch(() => {
            this.getContent(this.selectYear)        
          })
      }
    },
    async saveEdit () {  
      await requestService.loadDistribution(this.$refs.table.renderData, this.selectYear)
      this.$alert('Изменения сохранены!', "Успешно", "success");
    },
    deleteEduWork () {
      this.$confirm("Вы действительно хотите удалить распределение?", "Подтверждение", 'question').then(() => {
        this.Delete()
      }) 
    },
    async Delete() {
      await requestService.deleteDistrubution(this.selectYear)
      this.getContent(this.selectYear)
    },
    async add (stateDelete) {
      const response = await requestService.addEduLoad(this.content_eduLoad, this.eduLoad_year, stateDelete)
      if (response.status == 201) {
        this.$alert(response.data.message, "Успешно", "success");
      } else {
        this.$alert('Ошибка в добавление данных!', "Ошибка", "error");
      }
    },
    getParsedList (users) {
      let listUsers = []
      for(let i = 0; i < users.length; i++) {
        listUsers[i] = users[i].users_name         
      }
      return listUsers
    },
    contentState (content, state) {
      for(let i = 0; i < content.length; i++) {
        for(let j = 0; j < state.length; j++) {
          if (content[i].eduload_id == state[j].eduload_id) {
            if (state[j].teacher_lec != null) {          
              content[i].key = 'teacher_lec'
              content[i].teacher_lec = state[j].teacher_lec          
            }
            if (state[j].teacher_prac != null) {
              content[i].key = 'teacher_prac'
              content[i].teacher_prac = state[j].teacher_prac
            }
            if (state[j].teacher_lab != null) {
              content[i].key = 'teacher_lab'
              content[i].teacher_lab = state[j].teacher_lab
            }
            if (state[j].teacher_idz != null) {
              content[i].key = 'teacher_idz'
              content[i].teacher_idz = state[j].teacher_idz
            }
          }
        }
      }  
    }
  }
}
</script>

<style scoped>
.text-display {
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
.selectYear {
  margin-left: 900px;
  margin-top: -30px;
  margin-bottom: 10px;;
}
</style>
