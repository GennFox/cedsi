import Vue from 'vue';
import Vuex from 'vuex';
import globalAxios from '../axios-auth'
import router from '../router'
// import VueResource from "vue-resource"
// import VueLocalStorage from 'vue-localstorage';

// Vue.use(VueLocalStorage);
Vue.use(Vuex);
Vue.use(router);

export const store =new Vuex.Store({
    state:{
        idToken: null,
        userId: null,
        user: null,
        status:null,
        roles:['/dashboard','/console','/EduAdmin','/Admin','/superAdmin'],
        roleId:0,
        //superAdmin data
        adminList:[],
        adminCurrentList:[],
        limit:10
    },
    getters:{
        isAuthenticated(state) {
            return state.idToken !== null
          },
        whichRole(state){
            return state.roles[state.roleId-1]
        }
    },
    mutations:{
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
          },
          changeAdminList(state,adminList){
            state.adminList=adminList
            
          },
          changeAdminCurrentList(state,value){
            state.adminCurrentList=state.adminList.slice(value, value + state.limit);
          }
    },
    actions:{
        login({ commit, dispatch,state }, authData) {
            globalAxios.post("/user/login",  
          {"username":authData.username,"password":authData.password})
          .then(
            response => {
              console.log(response);
              state.idToken = response.data.token;
              localStorage.setItem('idToken', state.idToken);
              state.status = response.data.status;
              if(state.status=='fail'){
                console.log('error')
              }
              else{
                state.roleId = response.data.role;
                router.replace({path:state.roles[state.roleId-1]})
              }
            },
            error => {
              router.push({path:'/404'})
              console.log(error);
            }
        );
      },
      logout: ({ commit }) => {
        commit('clearAuthData');
        localStorage.removeItem('idToken');
        localStorage.removeItem('userId');
        router.replace('/')
        // localStorage.removeItem('userId');
      },
      //superAdmin方法
      //superAdmin get Admin 
      
      getAdmin({commit,dispatch,state}){
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
        response=>{
          console.log(response)
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
          commit("changeAdminList",admin_table)
          commit("changeAdminCurrentList",0)

      },
        error=>{
          console.log(error)

        }
      )
    }
  }
})