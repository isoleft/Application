<template>
<div>
    <div>
    <div style="margin-left: 10px;" v-if="access === 0">
    <button style="margin-top: 10px; margin-bottom: 10px;"
        v-for="tab in tabsSecretary"
        v-bind:key="tab"
        v-bind:class="['tab-button', { active: currentTab === tab }]"
        v-on:click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div style="margin-left: 10px;" v-else>
    <button style="margin-top: 10px; margin-bottom: 10px;"
        v-for="tab in tabsTeacher"
        v-bind:key="tab"
        v-bind:class="['tab-button', { active: currentTab === tab }]"
        v-on:click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    
    <div v-if="plan_actual != 'Одобрен'" style="margin-bottom: 10px;">
        <button v-if="access === 0 && plan_actual != 'На рассмотрении'" class="btn btn-block btn-primary" style="width: 250px; margin-left: 0.5%;" @click="notification(null)">Уведомить преподавателя</button>
        <div v-else-if="access === 1 && plan_actual != 'На рассмотрении'">
        <button v-if="currentTab === tabsTeacher[0] || currentTab === tabsTeacher[1]" class="btn btn-block btn-primary" style="width: 250px; margin-left: 0.5%;" @click="notification('error')">Сообщить об ошибке</button>
        <button class="btn btn-block btn-primary" style="width: 250px; margin-left: 0.5%;" @click="notification('send')">Отправить зав.кафедрой</button>
        </div>
        <div v-else-if="access === 2">
        <button class="btn btn-block btn-primary" style="width: 250px; margin-left: 0.5%;" @click="notification('error')">Сообщить об ошибке</button>
        <button class="btn btn-block btn-primary" style="width: 250px; margin-left: 0.5%;" @click="notification('send')">Одобрить план</button>
        </div>
    </div>
    </div>

    <modalWork v-if="showModalWork" v-bind:plan_id="this.$route.params.id" v-bind:currentTab="currentTab" @close="closeModalWork()"></modalWork>
    <modalKey v-if="showModalKey" v-bind:year="year" v-bind:currentTab="currentTab" @close="closeModalKey()"></modalKey>


    <!--<p style="text-align: center; font-size: 25pt; text-decoration: underline;">Учебная работа на {{currentTab}} семестр {{this.$route.params.info.plan_year}} уч.год</p>
    <p style="text-align: center; font-weight: 600;">{{this.$route.params.info.plan_post}} {{this.$route.params.info.plan_name}} ({{this.$route.params.info.plan_bet}} ст.)</p>-->

    <div v-if="currentTab !== tabsTeacher[7]">
    <BeeGridTable v-if="currentTab !== tabsTeacher[0] && currentTab !== tabsTeacher[1]"
        border
        highlight-row    
        :showPager="false"
        :loading="false"
        :showFilter="false"
        :columns="columsTypicalWork"
        :data="contentTypicalWork"
        >
        <template v-if="plan_actual != 'Одобрен' && plan_actual != 'На рассмотрении' && access == 1" slot-scope="{ }" slot="header">
            <button v-if="currentTab != tabsTeacher[6]" style="width: 180px; background-color: grey;" @click="showModalWork = true"><img src="@/assets/plus1.png">Добавить из списка</button>
            <button style="width: 170px; background-color: grey;" @click="showModalKey = true"><img src="@/assets/keyboard.png"> Добавить вручную</button>
        </template>

        <template v-if="plan_actual == 'Одобрен'" slot-scope="{ row }" slot="datatable_mark">
            <select v-model="row.datatable_mark" style="width: 150px" @change="changeMark(row)">
                <option disabled value="">Выберите отметку</option> 
                <option
                    v-for=" mark in listMark" :key="mark"
                    >{{ mark }}
                </option>
            </select>         
        </template>

        <template v-if="plan_actual != 'Одобрен' &&  plan_actual != 'На рассмотрении' && access == 1" slot-scope="{ row }" slot="delete">
            <img src="@/assets/delete1.png" @click="deleteTypicalWork(row.typicalwork_id)">          
        </template>
    </BeeGridTable>
    <BeeGridTable v-else
        border
        highlight-row  
        :showPager="false"
        :loading="false"
        :showFilter="false"
        :columns="columnsEduWork"
        :data="contentEduWork"       
    ></BeeGridTable>
    </div>
    <div v-else>
        <div v-if="access == 2">
            <button v-if="show1 == true" class="btn btn-block btn-primary" style="width: 350px; margin-left: 40%;" @click="addAssessment('осенний')">Добавить оценку за осенний семестр</button>
            <button v-if="show2 == true" class="btn btn-block btn-primary" style="width: 350px; margin-left: 40%;" @click="addAssessment('весенний')">Добавить оценку за весенний семестр</button>
        </div>
        <div class="assessment">
            <div v-for="assessment in contentAssessment" :key="assessment">
                <p>ОЦЕНКА РАБОТЫ ПРЕПОДАВАТЕЛЯ за {{ assessment.assessment_semestr }} семестр {{ year }} уч. г.</p>
                <p style="text-decoration: underline;"> {{assessment.assessment_comment}} </p>
            </div>      
        </div>
    </div>
</div>
</template>

<script>
import requestService from '@/services/requestsService'
import modalWork from '@/components/modalWork'
import modalKey from '@/components/modalKey'

export default {
  name: 'ContentPlan',
  components: {
    modalWork,
    modalKey
  },
  data () {
    return {
        currentTab: "Осенний семестр",
        tabsSecretary: ["Осенний семестр", "Весенний семестр"],
        tabsTeacher: ["Осенний семестр", "Весенний семестр", "Учебно-методическая работа", "Организационно-методическая работа", "Научно-исследовательская работа", 
        "Воспитательная работа", "Повышение квалификации", "Оценка работы преподавателя"],
        listMark: ['Выполнено', 'Заменено', 'Перенесено', 'Отменено', 'Не выполнено'],
        contentTypicalWork: null,
        contentEduWork: null,
        contentAssessment: null,
        columnsEduWork: [
            {
            title: "Дисциплина",
            key: "dataeduwork_name",
            align: "center",
            width: 200,
            resizable: true,
            sortable: true
            },
            {
            title: "Курс",
            key: "dataeduwork_kurs",
            align: "center",
            width: 60,             
            },
            {
            title: "Группа",
            key: "dataeduwork_group",
            align: "center",
            width: 90,
            resizable: true,
            sortable: true         
            },
            {
            title: "Зад.",
            key: "dataeduwork_task",
            align: "center",
            width: 60
            },
            {
            title: "Студентов",
            key: "dataeduwork_students",
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
                                key: "dataeduwork_lec",
                                align: "center",
                                width: 100,                                                       
                            },
                            {
                                title: "Лабораторные",
                                key: "dataeduwork_lab",
                                align: "center",
                                width: 130,                                                 
                            },
                            {
                                title: "Практические",
                                key: "dataeduwork_prac",
                                align: "center",
                                width: 130,                               
                            },
                            {
                                title: "Зачеты",
                                key: "dataeduwork_zach",
                                align: "center",
                                width: 90,         
                            },
                            {
                                title: "Экзамены",
                                key: "dataeduwork_ekz",
                                align: "center",
                                width: 100,                                
                            },
                            {
                                title: "Рук. ВКР",
                                key: "dataeduwork_lead_vkr",
                                align: "center",
                                width: 90,                             
                            },
                            {
                                title: "Рук. практикой",                        
                                align: "center",
                                children: [
                                    {
                                        title: "Учеб.",
                                        key: "dataeduwork_p_edu",
                                        align: "center",
                                        width: 60,                                    
                                    },
                                    {
                                        title: "Произ.",
                                        key: "dataeduwork_p_prod",
                                        align: "center",
                                        width: 70,                                        
                                    },
                                    {
                                        title: "Преддип.",
                                        key: "dataeduwork_p_dip",
                                        align: "center",
                                        width: 85,                                         
                                    }
                                ]
                            },
                            {
                                title: "Участие в итог. атт.",                        
                                align: "center",
                                children: [
                                    {
                                        title: "Гос.экз.",
                                        key: "dataeduwork_gos",
                                        align: "center",
                                        width: 70,                                       
                                    },
                                    {
                                        title: "Защ. ВКР",
                                        key: "dataeduwork_vkr",
                                        align: "center",
                                        width: 85,                                   
                                    }
                                ]
                            },               
                            {
                                title: "Об. СРС",
                                key: "dataeduwork_srs",
                                align: "center",
                                width: 90,                            
                            },
                            {
                                title: "Рук. асп.",
                                key: "dataeduwork_asp",
                                align: "center",
                                width: 80,                                 
                            },
                            {
                                title: "Всего I-я",
                                key: "dataeduwork_sum1",
                                align: "center",
                                width: 120,                                
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
                                        key: "dataeduwork_p_lec",
                                        align: "center", 
                                        width: 60,                                                                                             
                                    },
                                    {
                                        title: "лаб.",
                                        key: "dataeduwork_p_lab",
                                        align: "center",
                                        width: 60,                                        
                                    },
                                    {
                                        title: "прак.",
                                        key: "dataeduwork_p_prac",
                                        align: "center",
                                        width: 60,                                     
                                    },
                                    {
                                        title: "тем курc. ИДЗ",
                                        key: "dataeduwork_p_theme",
                                        align: "center",
                                        width: 120,                                      
                                    }
                                ]                                                  
                            },
                            {
                                title: "Всего II-я",
                                key: "dataeduwork_sum2",
                                align: "center",                             
                                width: 90,                              
                            },
                        ]
                    }      
                ]
            }
        ],
        columsTypicalWork: [],
        access: null,
        plan_actual: null,
        showModalWork: false,
        showModalKey: false,
        year: null,
        show1: true,
        show2: true
    }
  },
  mounted () {
    this.getContent() 
  },
  watch: {
    currentTab: function () {
        this.getContent()
    }
  },
  methods: {
    async getContent () { 
        const response = await requestService.fetchPlanContent(this.$route.params.id, this.currentTab)
        this.access = response.data.access_id
        this.plan_actual = response.data.plan_actual
        this.year =  response.data.year
        if (this.currentTab != this.tabsTeacher[0] && this.currentTab != this.tabsTeacher[1] && this.currentTab != this.tabsTeacher[7]) {
            this.columsTypicalWork = response.data.columns
            this.contentTypicalWork = response.data.content  
            console.log(this.columsTypicalWork)                   
        } else if (this.currentTab == this.tabsTeacher[7]) {
            this.contentAssessment = response.data.content
            this.parsedAssessment(this.contentAssessment)         
        }
         else {      
            this.contentEduWork = response.data.content              
        }  
    },
    async changeMark (object) {
        await requestService.assessmentAdd(null, null, null, object)
    },
    deleteTypicalWork (id) {
        this.$confirm("Вы действительно хотите удалить выбранную работу?", "Подтверждение", 'question').then(() => {
            this.delete(id)
        });      
    },
    async delete (id) {
        await requestService.deleteTypicalWorkfromContent(this.$route.params.id, id, this.currentTab)   
        this.getContent()
    },
    notification (choiceButton) {
        if (this.access == 0) {    
            this.$confirm("Вы действительно хотите уведомить преподвателя?" , "Подтверждение", 'question').then(() => { 
                this.addNotifiration(this.$route.params.id, '', this.currentTab, choiceButton)          
            });
        } else if (this.access == 1) {
            if (choiceButton == 'error') {
                this.$prompt("Вы действительно хотите уведомить ученого секретаря об ошибке? ", 'Введите сообщение', 'Подтверждение', 'question').then((text) => { 
                    this.addNotifiration(this.$route.params.id, text, this.currentTab, choiceButton)   
                })
            } else {
                this.$confirm("Вы действительно хотите отправить план заведующему кафедрой?" , "Подтверждение", 'question').then(() => { 
                    this.addNotifiration(this.$route.params.id, '', this.currentTab, choiceButton)          
                });
            }
        } else {
            if (choiceButton == 'error') {
                this.$prompt("Вы действительно хотите уведомить преподавателя об ошибке? ", 'Введите сообщение', 'Подтверждение', 'question').then((text) => { 
                    this.addNotifiration(this.$route.params.id, text, null, choiceButton)   
                })
            } else {
                this.$confirm("Вы действительно хотите одобрить план?" , "Подтверждение", 'question').then(() => { 
                    this.addNotifiration(this.$route.params.id, '', null, choiceButton)          
                });
            }
        }  
    },
    async addNotifiration (userPlan_id, message_content, currentTab, choiceButton) {
        const response = await requestService.sendMessage(userPlan_id, message_content, currentTab, choiceButton)
        if (response.data.message == 'ok') {
            this.$alert('Сообщение отправлено', "Успешно", "success");
            if (this.access == 2) {
                this.$router.push({ name: 'MainManager'})
            }
        } else {
            this.$alert(response.data.message, "Ошибка", "error");
        }
        this.getContent()
    },
    parsedAssessment(content) {
        for (let i = 0; i < content.length; i++) {        
            if (content[i].assessment_semestr == 'осенний') {
                this.show1 = false
            } else if (content[i].assessment_semestr == 'весенний'){
                this.show2 = false
            }
        }
    },
    addAssessment (semestr) {
        this.$prompt("", 'Введите содержимое оценки', 'Оценка работы преподавателя за ' + semestr + ' семестр', 'question').then((text) => { 
            this.assessment(this.$route.params.id, semestr, text)
        }) 
    },
    async assessment (id, semestr, text) {
        await requestService.assessmentAdd(id, semestr, text, null)
        this.getContent()
    },
    closeModalWork () {
        this.showModalWork = false
        this.getContent()
    },
    closeModalKey () {
        this.showModalKey = false
        this.getContent()
    }
  }   
}
</script>

<style scoped>
.assessment {
    text-align: center;
    font-family: Century Gothic;
    font-size: 30px;
    color: rgb(163, 161, 165); 
    margin-top: 5%;
}
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
</style>
