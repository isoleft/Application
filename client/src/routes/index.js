import Plans from '@/components/pages/Plans.vue'
import NewPlan from '@/components/pages/NewPlan.vue'
import EditPlan from '@/components/pages/EditPlan.vue'
import ContentPlan from '@/components/pages/ContentPlan.vue'
import LoginPage from '@/components/pages/LoginPage.vue'
import MainTeacher from '@/components/pages/MainTeacher.vue'
import EduWork from '@/components/pages/EduWork.vue'
import EduWorkContent from '@/components/pages/EduWorkContent.vue'

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/plans',
    name: 'Plans',
    component: Plans
  },
  {
    path: '/newPlan',
    name: 'NewPlan',
    component: NewPlan
  },
  {
    path: '/editPlan',
    name: 'EditPlan',
    component: EditPlan
  },
  {
    path: '/plans/:id',
    name: 'ContentPlan',
    component: ContentPlan
  },
  {
    path: '/teacher',
    name: 'MainTeacher',
    component: MainTeacher
  },
  {
    path: '/edu_work',
    name: 'EduWork',
    component: EduWork
  },
  {
    path: '/edu_work/:id',
    name: 'EduWorkContent',
    component: EduWorkContent
  }

]
export default routes
