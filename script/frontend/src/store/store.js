/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Vuex from 'vuex'

import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"
import initializer from "./core/init"; //<-- registering modules
import init from './init'; // I suggest to ignore init folder completly
Vue.use(Vuex)

const store = new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  strict: true,
});
initializer(store); // register modules
store.registerModule('store',init); //? I think we don't need this module
export default store;

