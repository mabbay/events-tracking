/*=========================================================================================
  File Name: i18n.js
  Description: i18n configuration file. Imports i18n data.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VueI18n from 'vue-i18n'
import i18nData from './i18nData'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'en', // set default locale
  messages: i18nData
});
export default i18n;

Vue.filter('t',function(text){
  return i18n.t(text);
  return  this.$t(text);
});

