import api from '@/services/api'
import session from '@/services/session'

export default {
  //авторизация
  Authorization (params) {
    return api().post('/', params)
  },
  //регистрация
  addNewUser (params) {
    return api().post('registration', params)
  },
  listDepartment () {   
    return api().get('registration')
  },
  //учебная нагрузка
  addEduLoad (params, year, stateDelete) {
    return api().post('workloadEditor', {
      eduload_year: year,
      stateDelete: stateDelete,
      params
    }, 
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  fetchContent (year) { 
    return api().get('workloadEditor', {
      params: {
        year: year
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  loadDistribution (arrayObject, year) {
    return api().put('workloadEditor', {
      arrayObject,  
      year: year
    }, 
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  deleteDistrubution (year) {
    return api().delete('workloadEditor', {
      params: {
        year: year
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  // главная страница секретаря
  fetchListPlans (year) { 
    return api().get('mainSecretary', {
      params: {
        year: year
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  // главная страница преподавателя
  fetchListPlansTeacher (year) { 
    return api().get('mainTeacher', {
      params: {
        year: year
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  addPlanTeacher (object) {
    return api().post('mainTeacher', {
      object
    }, 
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  // главная страница заведующего кафедрой
  fetchListPlansManager () { 
    return api().get('mainManager', {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  //Изменения плана
  fetchInfoPlan (params) { 
    return api().get(`editPlan/${params.id}`, { 
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  updateInfoPlan (id, object) {   
    return api().put(`editPlan/${id}`, {
      object   
    },
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  //Страница контента индивидуального плана
  fetchPlanContent (id, currentTab) { 
    return api().get(`contentPlan/${id}`, {
      params: {
        currentTab: currentTab
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  deleteTypicalWorkfromContent (id, idWork, currentTab) {
    return api().delete(`contentPlan/${id}`, {
      params: {
        idWork: idWork,
        currentTab: currentTab
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  sendMessage(id, message_content, currentTab, choiceButton) {
    return api().post(`contentPlan/${id}`, {
      message_content: message_content,
      currentTab: currentTab,
      choiceButton: choiceButton
    }, 
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  assessmentAdd (id, semestr, text, object) {   
    return api().put(`contentPlan/${id}`, {
      semestr,
      text,
      object
    },
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  //Страница редактора типовых работ
  fetchTypicalContent (currentTab, year) {
    return api().get('typicalworkEditor', {
      params: {
        currentTab: currentTab,
        year: year
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  addTypicalWorkFromPlan(object, year) {
    return api().post('typicalworkEditor', {
      object,
      year
    }, 
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  deleteTypicalWork (typicalwork_id, tabletype_id) {
    return api().delete('typicalworkEditor', 
    {
      params: {
        typicalwork_id: typicalwork_id,
        tabletype_id: tabletype_id
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  // страница диплоиников
  fetchTypicalContentDip () {
    return api().get('listdip', {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  addDip(object) {
    return api().post('listdip', {
      object
    }, 
    {
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  deleteDip (id) {
    return api().delete('listdip', 
    {
      params: {
        id: id  
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
  //Список одобренных планов
  fetchListApprovedPlans (year) { 
    return api().get('approvedplans', {
      params: {
        year: year
      },
      headers: {
        Authorization: session.getToken()
      }
    }).catch(function(error) {
      session.Error(error)
    })
  },
}
