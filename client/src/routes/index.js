import MainSecretary from '@/components/pages/MainSecretary.vue'
import EditPlan from '@/components/pages/EditPlan.vue'
import ContentPlan from '@/components/pages/ContentPlan.vue'
import LoginPage from '@/components/pages/LoginPage.vue'
import MainTeacher from '@/components/pages/MainTeacher.vue'
import Registration from '@/components/pages/Registration.vue'
import WorkloadEditor from '@/components/pages/WorkloadEditor.vue'
import TypicalWorkEditor from '@/components/pages/TypicalWorkEditor.vue'
import MainManager from '@/components/pages/MainManager.vue'
import listDip from '@/components/pages/listDip.vue'
import approvedPlans from '@/components/pages/approvedPlans.vue'

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/mainSecretary',
    name: 'MainSecretary',
    component: MainSecretary
  },
  {
    path: '/workloadEditor',
    name: 'WorkloadEditor',
    component: WorkloadEditor
  },
  {
    path: '/editPlan/:id',
    name: 'EditPlan',
    component: EditPlan
  },
  {
    path: '/contentPlan/:id',
    name: 'ContentPlan',
    component: ContentPlan
  },
  {
    path: '/mainTeacher',
    name: 'MainTeacher',
    component: MainTeacher
  },
  {
    path: '/mainManager',
    name: 'MainManager',
    component: MainManager
  },
  {
    path: '/listdip',
    name: 'listDip',
    component: listDip
  },
  {
    path: '/typicalworkEditor',
    name: 'TypicalWorkEditor',
    component: TypicalWorkEditor
  },
  {
    path: '/approvedplans',
    name: 'approvedPlans',
    component: approvedPlans
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration
  }

]
export default routes
