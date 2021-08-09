<template>
	
  <div>
    <BeeGridTable class="left"
    border
    highlight-row
    ref="table"
    :showPager="false"
    :showFilter="false"
    :columns="columns"
    :data="content"
    width="953"
    > 

    <template slot-scope="{ }" slot="header">
        <button style="width: 120px; background-color: grey;" @click="showModalDip = true"><img src="@/assets/plus1.png">Добавить</button>
    </template>
    <template slot-scope="{ row }" slot="delete">
        <img src="@/assets/delete1.png" @click="Delete(row.listdip_id)">      
    </template>

    </BeeGridTable>

    <modalDip v-if="showModalDip" v-bind:listTeacher="listTeacher" @close="closeModalDip()"></modalDip>

  </div>
</template>

<script>
import requestService from '@/services/requestsService'
import modalDip from'@/components/modalDip'

export default {
  name: "listDip",
  components: {
    modalDip
  },
  data () {
    return {
      content: null,
      listTeacher: null,
      columns: [
          {
            title: "Группа",
            key: "listdip_group",
            align: "center",
            width: 200,
            sortable: true
          },
          {
            title: "Преподаватель",
            key: "listdip_teacher_name",
            align: "center",
            width: 300
          },
          {
            title: "Количество дипломников",
            key: "listdip_students",
            align: "center",
            width: 300
          },
          {
            title: " ",
            slot: "delete",
            headSlot: 'header',
            key: "delete",
            align: 'center',
            width: 150
          }
      ],
      showModalDip: false
    }
  },
  mounted () {
    this.getContent()
  },
  methods: {
    async getContent () {
        const response = await requestService.fetchTypicalContentDip()
        this.content = response.data.content
        this.listTeacher = response.data.teachers   
    },
    async Delete(id) {     
        await requestService.deleteDip(id)
        this.getContent()
    },
    closeModalDip () {
        this.showModalDip = false
        this.getContent()
    }
    }
}
</script>

<style scoped>
.left {
    margin-left: 10px;
}
</style>
