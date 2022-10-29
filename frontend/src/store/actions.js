/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import http from '../core/axios';

const actions = {

  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu
  updateVerticalNavMenuWidth({ commit }, width) {
    commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width)
  },

  // VxAutoSuggest
  updateStarredPage({ commit }, payload) {
    commit('UPDATE_STARRED_PAGE', payload)
  },

  // The Navbar
  arrangeStarredPagesLimited({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_LIMITED', list)
  },
  arrangeStarredPagesMore({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_MORE', list)
  },

  // /////////////////////////////////////////////
  // UI
  // /////////////////////////////////////////////

  toggleContentOverlay({ commit }) {
    commit('TOGGLE_CONTENT_OVERLAY')
  },
  updateTheme({ commit }, val) {
    commit('UPDATE_THEME', val)
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  updateUserInfo({ commit }, payload) {
    commit('UPDATE_USER_INFO', payload)
  },

  // get user info, whenever it's needed
  getUserInfo(context) {
    // user is auth
    if (context.getters.isAuth) return;

    console.log('calling store.actions.getUser');
    const authToken = window.localStorage.getItem('auth-token');
    if (!authToken) return;

    console.log('auth token exists');
    // send req to /users/me to make sure auth-token is valid
    return http.get('/api/users/me', { headers: { 'x-auth-token': authToken } })
      .then(res => {
        //! using the old auth-token
        res.headers['x-auth-token'] = authToken;
        context.commit('SET_USER_INFO', res);
        console.log('auth token valid');
      })
      .catch(err => {
        context.commit('REMOVE_USER_INFO');
        console.log('auth token invalid', err);
      });
  },

  async signup(context, payload) {
    // because it will be sent as an empty string if we leave it
    // if (userData.company === '') delete userData.company;
    const res = await http.post('/api/users/signup', payload);
    console.log('--signup--res', res);
    context.commit('SET_USER_INFO', res);
  },

  async login(context, payload) {
    const res = await http.post('/api/users/login', payload);
    console.log('--login-res--', res);
    context.commit('SET_USER_INFO', res);
  },

  logout(context) {
    context.commit('REMOVE_USER_INFO');
  }
}

export default actions
