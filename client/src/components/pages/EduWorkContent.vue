<template>
<div>
    <div class="action-button">
    <Button type="info"  >Import</Button>
    <Button type="primary"   @click="exportXlsx()">Export</Button>
    <Button type="warning"   @click="printData()">Print</Button>
    <Button type="error" style="margin-left: 1480px;" @click="sendPlan()">Отправить на доработку</Button>
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
</BeeGridTable>
</print>
</div>
</template>

<script>
export default {
  name: 'EduWorkContent',
  data () {
    return {
        contentPlan: [],
        content: {},
        plans: [],
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
        this.content = JSON.parse(localStorage.getItem('plans')).find(item => item.name == this.$route.params.id)  
      } catch(e) {
        localStorage.removeItem('plans')
      }
    }
  },
  methods: {
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
          this.plans[this.indexArray()].state = 'доработка'
          let parsed = JSON.stringify(this.plans)
          localStorage.setItem('plans', parsed)
          this.$alert("Учебная работа отправлена ученому секретарю на доработку", "Отправлено", "success");
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
