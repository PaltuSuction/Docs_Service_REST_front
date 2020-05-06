import Vue from 'vue'
import VueRouter from 'vue-router'
import TableCreateView from "../views/TabeCreateView";
import TableEditView from "../views/TableEditView";
import AllTables from "../components/AllTables";
import AdminFunctions from "../views/AdminFunctions";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import Home from "../components/Home";
import GroupsView from "../views/GroupsView";
import store from "../store.js";
Vue.use(VueRouter)

const routes = [
   {
     path: '/',
     name: 'home',
     component: Home,
     meta: {
      requiresAuth: true
     },
     children: [
         {
          path: '/create_table',
          name: 'tableCreateView',
          component: TableCreateView,
        },
         {
          path: '/edit_table',
          name: 'tableEditView',
          component: TableEditView,
        },
         {
          path: '/all_tables',
          name: 'allTablesView',
          component: AllTables,
        },
        {
          path: '/all_groups',
          name: 'groupsView',
          component: GroupsView,
        },
        {
          path: '/admin_functions',
          name: 'adminFunctions',
          component: AdminFunctions,
        },
     ]
  },
  {
    path: '/login',
    name: 'loginForm',
    component: LoginForm
  },
  {
    path: '/registration',
    name: 'registrationForm',
    component: RegistrationForm
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
          next()
          return
        }
        next('/login')
      } else {
        next()
      }
})

export default router
