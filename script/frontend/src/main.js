/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from 'vue'
import App from './App.vue'
import _ from 'lodash'; 
import moment from 'moment';  
import StoreinoApp from './core/apps'
import Unicon from 'vue-unicons'
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
import { uniShop, uniSearch, uniApps, uniCube, uniBox, uniGift, uniArchive, uniTruck, uniTrashAlt, uniShoppingBag, uniTransaction, uniUser, uniSetting, uniAnalytics, uniHomeAlt , uniCircle , uniDocumentLayoutRight ,uniImages,uniMegaphone , uniPaintTool,uniPalette ,uniEye,uniFolder,uniYoutube,uniFileEditAlt } from 'vue-unicons/src/icons'

Unicon.add([uniShop, uniSearch, uniApps, uniCube, uniBox, uniGift, uniArchive, uniTruck, uniTrashAlt, uniShoppingBag, uniTransaction, uniUser, uniSetting, uniAnalytics, uniHomeAlt , uniCircle, uniDocumentLayoutRight ,uniImages,uniMegaphone, uniPaintTool,uniPalette ,uniEye,uniFolder,uniYoutube ,uniFileEditAlt   ])
Vue.use(Unicon,{
  height: 21,
  width: 21
})

// Vuesax Component Framework
Vue.use(Vuesax)
Vue.filter('price',function(number){
  let num = 0;
  if (typeof number == "number" ) num = (number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return num;
});

window.escape = function(text) {
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// axios
import axios from "./core/axios.js"
Vue.prototype.$http = axios


// Theme Configurations
import '../config/theme.js'


// Globally Registered Components
import './core/components.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './core/router'


// Vuex Store
import store from './store/store'

// i18n
import i18n from './i18n/i18n'

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer);

// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// Feather font icon
require('./assets/css/iconfont.css')
   
Object.defineProperty(Vue.prototype, '$_', { value: _ });
Object.defineProperty(Vue.prototype, '$moment', { value: moment });


function hasPermission(model,access){
  return true;
}

Object.defineProperty(Vue.prototype,'$hasPermission',{ value : hasPermission });


const flags = require('./assets/flags/countries.json');
function getFlug(countrie) {
  let flag = null;
  let dataCountrie = _.find(flags, { 'isoAlpha2': countrie.toUpperCase() });
  if (typeof dataCountrie != "undefined") flag  = dataCountrie.flag;
  return flag;
}

Object.defineProperty(Vue.prototype, '$getFlug', { value: getFlug });


// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';


Vue.config.productionTip = false

// const vm = new Vue({
//     router,
//     store,
//     i18n,
//     render: h => h(App)
// }).$mount('#app')

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
window.StoreinoApp = StoreinoApp;