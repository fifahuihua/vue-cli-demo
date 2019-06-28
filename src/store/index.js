import Vue from 'vue';
import Vuex from 'vuex';
import UserGw from '@/api/user.client.gw';

Vue.use(Vuex);

const state = {
  loginUser: null
};

const mutations = {
  userLogin(state, loginUser) {
    state.loginUser = loginUser;
  }
};

const actions = {
  async checkSession({ commit }) {
    try {
      const res = await UserGw.checkSession();
      if (res.data.status == 'success') {
        commit('userLogin', res.data.user);
      } else {
        throw new Error(res);
      }
    } catch (err) { }
  },
  saveUserInfo({ commit }, userInfo) {
    commit('userLogin', userInfo);
  }
};

export default new Vuex.Store({
  state,
  actions,
  mutations
});
