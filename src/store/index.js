import Vue from 'vue';
import Vuex from 'vuex';
import globalAxios from '../axios-auth'
import router from '../router'
// import VueResource from "vue-resource"
// import VueLocalStorage from 'vue-localstorage';

// Vue.use(VueLocalStorage);
Vue.use(Vuex);
Vue.use(router);

export const store = new Vuex.Store({
  state: {
    url:'../../../../static/images/',
    idToken: null,
    expirationDate: null,
    userId: null,
    user: null,
    status: null,
    roles: ['/dashboard', '/console', '/EduAdmin', '/Admin', '/superAdmin'],
    roleId: 0,
    //superAdmin data
    adminList: [],
    adminCurrentList: [],
    limit: 10
  },
  getters: {
    isAuthenticated(state) {
      return state.idToken !== null
    },
    // whichRole(state) {
    //   return state.roles[state.roleId - 1]
    // }
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    storeUser(state, user) {
      state.user = user
    },
    clearAuthData(state) {
      state.idToken = null;
      state.userId = null;
      state.expirationDate=null;
      state.roleId = 0;
    },
    changeAdminList(state, adminList) {
      state.adminList = adminList

    },
    changeAdminCurrentList(state, value) {
      state.adminCurrentList = state.adminList.slice(value, value + state.limit);
    }
  },
  actions: {
    login({ commit, dispatch, state }, authData) {
      globalAxios.post("/user/login",
        { "username": authData.username, "password": authData.password })
        .then(
          response => {
            console.log(response);
            state.expirationDate=response.data.expirationDate;
            state.idToken = response.data.token;
            localStorage.setItem('idToken', state.idToken)
            state.roleId = response.data.role;
            state.user = authData.username
            localStorage.setItem('user',state.user)
            localStorage.setItem('roleId',state.roleId)
            localStorage.setItem('expirationDate',state.expirationDate)
            state.status = response.data.status
            if (state.status == 'fail') {
              console.log('error')
            }
            else {
              router.replace({ path: state.roles[state.roleId - 1] })
            }
          },
          error => {
            router.push({ path: '/404' })
            console.log(error);
          }
        );
    },
    signup({ commit, dispatch }, authData) {
      globalAxios.post("/user/register",
        { "username": authData.username, "password": authData.password})
        .then(
          response => {
            console.log(response);
            this.$router.replace({ path: '/signin' })
          },
          error => {
            router.push({ path: '/404' })
            console.log(error);
          }
        );
    },
    tryAutoLogin({ commit, state }) {
      const token = localStorage.getItem('idToken');
       const expirationDate = new Date(localStorage.getItem('expirationDate'));
      const now = new Date();
      let flag=1;
      if (now.getTime>= expirationDate.getTime){
        console.log("过期");
      }else{
        console.log("未过期");
                flag=0;
      }
      if (!token||flag) {
        return;
      }

      const userId = localStorage.getItem('userId');
      commit('authUser', {
        token: token,
        userId: userId
      })
    },
    logout: ({ commit }) => {
      commit('clearAuthData');
      localStorage.removeItem('idToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('roleId');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('user');
      
      router.replace('/')
      // localStorage.removeItem('userId');
    },
    //superAdmin方法
    //superAdmin get Admin 
    getAdmin({ commit, state }) {
      globalAxios.get(
        "/superadmin/admin",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: state.idToken
          }
        }
      )
        .then(
          response => {
            //console.log(response)
            //console.log(response.data.data);
            var admin_arr = response.data.data;
            var admin_table = [];
            for (var i = 0; i < admin_arr.length; i++) {
              var admin = {};
              admin.username = admin_arr[i].USER_NAME;
              admin.id = admin_arr[i].USER_ID;
              if (admin_arr[i].USER_STATUS == "active") admin.status = "启用";
              else admin.status = "禁用";
              admin.character = "管理员";
              //console.log(admin)
              admin_table.push(admin);
            }
            //console.log(admin_table)
            commit("changeAdminList", admin_table)
            commit("changeAdminCurrentList", 0)
          },
          error => {
            console.log(error)

          }
        )
    },
    //superAdmin add Admin
    addAdmin({ commit, state ,dispatch}, addAdmin) {
      globalAxios
        .post(
          "/superadmin/admin",
          { username: addAdmin.username, password: addAdmin.password },
          {
            header: {
              "Content-Type": "application/json",
              Authorization: state.idToken
            }
          }
        )
        .then(
          response => {
            console.log(response);
            // var newAdmin = {}
            // newAdmin.username = addAdmin.username
            // newAdmin.password = addAdmin.password
            // newAdmin.status = "启用"
            // newAdmin.character = "管理员"
            // state.adminList.splice(0, 0, newAdmin);
            // commit("changeAdminCurrentList", (addAdmin.page * state.limit));
            dispatch("getAdmin")
          },
          error => {
            console.log(error);
          }
        );
    },
    //superAdmin delete Admin
    deleteAdmin({ commit, state }, deleteAdmin) {
      //console.log(deleteAdmin)
      globalAxios
        .delete(
          "/superadmin/admin?userId=" + deleteAdmin.id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: state.idToken
            }
          }
        )
        .then(
          response => {
            console.log(response);
            state.adminList.splice(deleteAdmin.index, 1);
            commit("changeAdminCurrentList", (deleteAdmin.page * state.limit));
          },
          error => {
            console.log(error);
          }
        );
    },
    updateAdminStatus({ state }, updateAdmin) {
      console.log(updateAdmin)
      globalAxios
        .put(
          "/superadmin/admin",
          { userId: updateAdmin.userId, status: updateAdmin.status },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: state.idToken
            }
          }
        )
        .then(
          response => {
            console.log(response);
          },
          error => {
            console.log(error);
          }
        );
    }
  }
})