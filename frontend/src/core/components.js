/*=========================================================================================
  File Name: globalComponents.js
  Description: Here you can register components globally
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VxTooltip from '../components/vx-tooltip/VxTooltip.vue'
import VxCard  from '../components/vx-card/VxCard.vue'
import SiForm  from '../components/si-form/SiForm.vue'
import SiTable  from '../components/si-table/SiTable.vue'
import SiProgressBar  from '../components/si-progress/SiProgressBar.vue'
import SiFormBar  from '../components/si-form/SiFormBar.vue'
import SiFilter  from '../components/si-filter/SiFilter.vue'
import SwitchLang  from '../components/SwitchLang.vue'
import SwitchCurrency  from '../components/SwitchCurrency.vue'
import VxList  from '../components/vx-list/VxList.vue'
import VxBreadcrumb  from '../components/VxBreadcrumb.vue'
import FeatherIcon  from '../components/FeatherIcon.vue'
import VxInputGroup  from '../components/vx-input-group/VxInputGroup.vue'

// storeino components
Vue.component(SiForm.name, SiForm)
Vue.component(SiTable.name, SiTable)
Vue.component(SiProgressBar.name, SiProgressBar)
Vue.component(SiFormBar.name, SiFormBar)
Vue.component(SwitchLang.name, SwitchLang)
Vue.component(SwitchCurrency.name, SwitchCurrency)

Vue.component(VxTooltip.name, VxTooltip)
Vue.component(VxCard.name, VxCard)
Vue.component(VxList.name, VxList)
Vue.component(SiFilter.name, SiFilter)
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component(VxInputGroup.name, VxInputGroup)