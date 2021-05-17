<template>
<div>
    <div class="action-button">
    <Button type="info"  >Import</Button>
    <Button type="primary"   @click="exportXlsx()">Export</Button>
    <Button type="warning"   @click="printData()">Print</Button>
    <Button type="info" style="margin-left: 1480px;" @click="sendPlan()">Отправить преподавателю</Button>
    </div>
<print ref="printPage">
    <h1 class="hh">{{content.name}} {{content.semestr}} семестр</h1>
<BeeGridTable
    border
    highlight-row
    ref="table"
    :showPager="false"
    :loading="false"
    :showFilter="false"
    :columns="columns"
    :data="contentPlan"
    :showSummary="true"
>  
      <template slot-scope="{ index }" slot="op">
        <Button type="error" size="small" @click="deleteRow(index)">Delete</Button>
      </template>

</BeeGridTable>
</print>
<div style="margin-top: 15px; margin-left: 5px;">
    <input type="text" size="15" v-model="name"/>
    <input type="text" size="4" v-model="kurs"/>
    <input type="text" size="6" v-model="group"/>
    <input type="text" size="2" v-model="task"/>
    <input type="text" size="7" v-model="students"/>
    <input type="text" size="3" v-model="lec"/>
    <input type="text" size="3" v-model="lab"/>
    <input type="text" size="2" v-model="practic"/>
    <input type="text" size="2" v-model="zach"/>
    <input type="text" size="3" v-model="ekz"/>
    <input type="text" size="5" v-model="lead_vkr"/>
    <input type="text" size="3" v-model="p_edu"/>
    <input type="text" size="4" v-model="p_prod"/>
    <input type="text" size="6" v-model="p_dip"/>
    <input type="text" size="4" v-model="gos"/>
    <input type="text" size="6" v-model="protection_vkr"/>
    <input type="text" size="5" v-model="srs"/>
    <input type="text" size="5" v-model="asp"/>
    <input type="text" size="3" style="margin-left:85px;" v-model="p_lec"/>
    <input type="text" size="3" v-model="p_lab"/>
    <input type="text" size="2" v-model="p_practic"/>
    <input type="text" size="11" v-model="p_theme"/>

    <button type="button" class="btn btn-success" style="width: 155px; margin-bottom: 12px;" @click="addRow()">Добавить</button>
</div>
</div>
</template>

<script>
export default {
  name: 'ContentPlan',
  data () {
    return {
        contentPlan: [],
        content: {},
        plans: [],
        name: null,
        kurs: null,
        group: null,
        task: null,
        students: null,
        lec: null,
        lab: null,
        practic: null,
        zach: null,
        ekz: null,
        lead_vkr: null,
        p_edu: null,
        p_prod: null,
        p_dip: null,
        gos: null,
        protection_vkr: null,
        srs: null,
        asp: null,
        sum1: null,
        p_lec: null,
        p_lab: null,
        p_practic: null,
        p_theme: null,
        sum2: null,
      columns: [
        {
          title: "Дисциплина",
          key: "name",
          align: "center",
          width: 200,
          resizable: true,
          sortable: true
        },
        {
          title: "Курс",
          key: "kurs",
          align: "center",
          width: 60,
          resizable: true       
        },
        {
          title: "Группа",
          key: "group",
          align: "center",
          width: 90,
          resizable: true,
        },
        {
          title: "Зад.",
          key: "task",
          align: "center",
          width: 60
        },
        {
          title: "Студентов",
          key: "students",
          align: "center",
          width: 100
        },
        {
            title: "Количество часов",
            align: "center",
            children: [
                {
                    title: "1-ая половина дня",                   
                    align: "center",
                    children: [
                        {
                            title: "Лекции",
                            key: "lec",
                            align: "center",
                            width: 100,
                            showSummary: true                          
                        },
                        {
                            title: "Лабораторные",
                            key: "lab",
                            align: "center",
                            width: 130,
                            showSummary: true                        
                        },
                        {
                            title: "Практические",
                            key: "practic",
                            align: "center",
                            width: 130,
                            showSummary: true  
                        },
                        {
                            title: "Зачеты",
                            key: "zach",
                            align: "center",
                            width: 90,
                            showSummary: true  
                        },
                        {
                            title: "Экзамены",
                            key: "ekz",
                            align: "center",
                            width: 100,
                            showSummary: true  
                        },
                        {
                            title: "Рук. ВКР",
                            key: "lead_vkr",
                            align: "center",
                            width: 90,
                            showSummary: true  
                        },
                        {
                            title: "Рук. практикой",                        
                            align: "center",
                            children: [
                                {
                                    title: "Учеб.",
                                    key: "p_edu",
                                    align: "center",
                                    width: 60,
                                    showSummary: true  
                                },
                                {
                                    title: "Произ.",
                                    key: "p_prod",
                                    align: "center",
                                    width: 70,
                                    showSummary: true  
                                },
                                {
                                    title: "Преддип.",
                                    key: "p_dip",
                                    align: "center",
                                    width: 85,
                                    showSummary: true  
                                }
                            ]
                        },
                        {
                            title: "Участие в итог. атт.",                        
                            align: "center",
                            children: [
                                {
                                    title: "Гос.экз.",
                                    key: "gos",
                                    align: "center",
                                    width: 70,
                                    showSummary: true  
                                },
                                {
                                    title: "Защ. ВКР",
                                    key: "protection_vkr",
                                    align: "center",
                                    width: 85,
                                    showSummary: true  
                                }
                            ]
                        },               
                        {
                            title: "Об. СРС",
                            key: "srs",
                            align: "center",
                            width: 90,
                            showSummary: true  
                        },
                        {
                            title: "Рук. асп.",
                            key: "asp",
                            align: "center",
                            width: 80,
                            showSummary: true  
                        },
                        {
                            title: "Всего I-я",
                            key: "sum1",
                            align: "center",
                            width: 120,
                            showSummary: true  
                        },
                    ]
                },
                {
                    title: "2-ая половина дня",               
                    align: "center",
                    children: [
                        {
                            title: "Подготовка",
                            align: "center", 
                            children: [
                                {
                                    title: "лек.",
                                    key: "p_lec",
                                    align: "center", 
                                    width: 60,
                                    showSummary: true                                                        
                                },
                                {
                                    title: "лаб.",
                                    key: "p_lab",
                                    align: "center",
                                    width: 60,
                                    showSummary: true    
                                },
                                {
                                    title: "прак.",
                                    key: "p_practic",
                                    align: "center",
                                    width: 60,
                                    showSummary: true    
                                },
                                {
                                    title: "тем курc. ИДЗ",
                                    key: "p_theme",
                                    align: "center",
                                    width: 120,
                                    showSummary: true    
                                }
                            ]                                                  
                        },
                        {
                            title: "Всего II-я",
                            key: "sum2",
                            align: "center",
                            resizable: true,
                            width: 90,
                            showSummary: true  
                        },
                    ]
                }      
            ]
        }
      ],     
    }
  },
  mounted () {
      if(localStorage.getItem('plans')) {
      try {     
        this.content = JSON.parse(localStorage.getItem('plans')).find(item => item.id == this.$route.params.id)  
      } catch(e) {
        localStorage.removeItem('plans')
      }
    }
  },
  methods: {
      addRow () {   
        this.sum1 = this.parsedNum(this.lec) + this.parsedNum(this.lab) + this.parsedNum(this.practic) + this.parsedNum(this.zach) 
        + this.parsedNum(this.ekz) + this.parsedNum(this.lead_vkr) + this.parsedNum(this.p_edu) + this.parsedNum(this.p_prod) 
        + this.parsedNum(this.p_dip) + this.parsedNum(this.gos) + this.parsedNum(this.srs) + this.parsedNum(this.asp)
        this.sum2 = this.parsedNum(this.p_lec) + this.parsedNum(this.p_lab) + this.parsedNum(this.p_practic) + this.parsedNum(this.p_theme) 
        if (this.sum1 == 0) {
            this.sum1 = null
        }
        if (this.sum2 == 0) {
            this.sum2 = null
        }      
        var obj = { name: this.name, kurs: this.kurs, group: this.group, task: this.task, students: this.students,
            lec: this.lec, lab: this.lab, practic: this.practic, zach: this.zach, ekz: this.ekz,
            lead_vkr: this.lead_vkr, p_edu: this.p_edu, p_prod: this.p_prod, p_dip: this.p_dip, gos: this.gos, 
            srs: this.srs, asp: this.asp, sum1: this.sum1, p_lec: this.p_lec, p_lab: this.p_lab, p_practic: this.p_practic, 
            p_theme: this.p_theme, sum2: this.sum2}
        this.name =  null,
        this.kurs = null,
        this.group = null,
        this.task = null,
        this.students = null,
        this.lec = null,
        this.lab = null,
        this.practic = null,
        this.zach = null,
        this.ekz = null,
        this.lead_vkr = null,
        this.p_edu = null,
        this.p_prod = null,
        this.p_dip = null,
        this.gos = null,
        this.protection_vkr = null,
        this.srs = null,
        this.asp = null,
        this.sum1 = null,
        this.p_lec = null,
        this.p_lab = null,
        this.p_practic = null,
        this. p_theme = null,
        this.sum2 = null,  
        this.contentPlan.push(obj)
      },
      deleteRow (value) {
        this.contentPlan.splice(value, 1)
      },
      parsedNum (value) {
        let pars = parseInt(value)
        if(isNaN(pars)) {
            return 0
        } else {
            return pars
        }
      },
      exportXlsx () {   
        this.$refs.table.exportXlsx({
        fileName: "data",
        header: ["name", "kurs", "group", "task", "students", "lec", "lab", "practic", "zach", "ekz", "lead_vkr", "p_edu", "p_prod", "p_dip", "gos", "protection_vkr", 
        "srs", "asp", "sum1", "p_lec", "p_lab", "p_practic", "p_theme", "sum2",],
        headerDisplay: { name: "name", kurs: "kurs" , group: "group", task: "task", students: "students", lec: "lec", lab: "lab", practic: "practic", zach: "zach",
        ekz: "ekz", lead_vkr: "lead_vkr", p_edu: "p_edu", p_prod: "p_prod", p_dip: "p_dip", gos: "gos", protection_vkr: "protection_vkr", srs: "srs", asp: "asp",
        sum1: "sum1", p_lec: "p_lec", p_lab: "p_lab", p_practic: "p_practic", p_theme: "p_theme", sum2: "sum2"},
        
      });
      },
      printData () {      
        //this.$htmlToPaper('printPage')
        this.$refs.printPage.print();
      },
      sendPlan () {
          this.plans = JSON.parse(localStorage.getItem('plans'))     
          this.plans[this.indexArray()].state = 'актуально'
          let parsed = JSON.stringify(this.plans)
          localStorage.setItem('plans', parsed)
          this.$alert("Учебная работа отправлена преподавателю", "Отправлено", "success");
      },
      indexArray () { 
          return this.plans.findIndex(item => item.id == this.$route.params.id)    
      }
  }   
}
</script>

<style scoped>
.action-button {
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.hh {
    text-align: center;
    font-family: Century Gothic;
    font-size: 30px;
    color: rgb(163, 161, 165);
}
</style>
