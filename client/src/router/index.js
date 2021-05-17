import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/routes/index'
import VueSimpleAlert from "vue-simple-alert";
import BeeGridTable from "beegridtable"
import BeelocaleRu from 'beegridtable/src/locale/lang/ru-RU'
import 'beegridtable/dist/styles/beegridtable.css'
import VueHtmlToPaper from 'vue-html-to-paper';
import Print from "@mathewparet/vue-print"

Vue.use(Print)

Vue.use(Router)
Vue.use(VueSimpleAlert)
Vue.use(BeeGridTable, {
  locale: BeelocaleRu,
  capture: true
})

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.use(VueHtmlToPaper, options);

export default new Router({
  mode: 'history',
  routes
})
