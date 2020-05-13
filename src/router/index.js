import Vue from 'vue'
import VueRouter from 'vue-router'
import TableCreateView from "../views/TabeCreateView";
import TableEditView from "../views/TableEditView";
import AllTables from "../components/AllTables";
import AdminFunctions from "../views/AdminFunctions";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import Home from "../components/Home";
import store from "../store.js";
import GroupTables from "../views/GroupTables";
import ProfileEditView from "../views/ProfileEditView";
import GroupTableInstance from "../components/GroupTableInstance";
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
          path: '/group_tables',
          name: 'groupTablesView',
          component: GroupTables,
        },
        {
          path: '/group_table_instance',
          name: 'groupTableInstance',
          component: GroupTableInstance,
        },
        {
          path: '/admin_functions',
          name: 'adminFunctions',
          component: AdminFunctions,
        },
        {
          path: '/profile_edit',
          name: 'profileEdit',
          component: ProfileEditView,
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
