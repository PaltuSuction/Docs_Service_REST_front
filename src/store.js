import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('user-token') || null,
    user : {},
    selected_table_id: '',
    month_names: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября",
                  "Ноября", "Декабря"],
    col_types: [
        'ИДЗ',
        'Тест',
        'Контрольная точка',
        'Контрольная работа',
        'Лабораторная работа',
        'Доклад',
        'Реферат',
        'Свой вариант',
    ],
    faculty_decryption: {
        'FKTI'      : 'ФКТИ',
        'INPROTECH' : 'ИНПРОТЕХ',
        'FRT'       : 'ФРТ',
        'FEL'       : 'ФЭЛ',
        'IFIO'      : 'ИФИО',
        'FEA'       : 'ФЭА',
        'FIBS'      : 'ФИБС',
        'GF'        : 'ГФ',
        'RY'        : 'РЯ'
    },
    direction_decryption: {
        '01.03.02' : 'Прикладная математика и информатика',
        '09.03.01' : 'Информатика и вычислительная техника',
        '09.03.02' : 'Информационные системы и технологии',
        '09.03.04' : 'Программная инженерия',
        '11.03.01' : 'Радиотехника',
        '11.03.02' : 'Инфокоммуникационные технологии и системы связи',
        '11.03.03' : 'Конструирование и технология электронных средств',
        '11.03.04' : 'Электроника и наноэлектроника',
        '12.03.01' : 'Приборостроение. Информационно-измерительная техника и технологии',
        '12.03.04' : 'Биотехнические системы и технологии',
        '13.03.02' : 'Электроэнергетика и электротехника',
        '20.03.01' : 'Техносферная безопасность',
        '27.03.02' : 'Управление качеством',
        '27.03.03' : 'Системный анализ и управление',
        '27.03.04' : 'Управление в технических системах',
        '27.03.05' : 'Инноватика',
        '28.03.01' : 'Нанотехнологии и микросистемная техника',
        '42.03.01' : 'Реклама и связи с общественностью',
        '45.03.02' : 'Лингвистика',
    //ФКТИ - магистратура
        '09.04.01' : 'Информатика и вычислительная техника (Маг)',
        '09.04.02' : 'Информационные системы и технологии (Маг)',
        '09.04.04' : 'Программная инженерия (Маг)',
        '01.04.02' : 'Прикладная математика и информатика (Маг)',
        '27.04.03' : 'Системный анализ и управление (Маг)',
        '27.04.04' : 'Управление в технических системах (Маг)'
    },
  },
  mutations: {
      auth_request: function(state){
        state.status = 'loading'
      },
      auth_success: function(state, user_info){
        state.status = 'success'
        state.token = user_info['token']
        state.user = user_info['user']
      },
      auth_error: function(state){
        state.status = 'error'
      },
      logout: function(state){
        state.status = ''
        state.token = ''
      },
  },
  actions: {
       logout({commit}){
              return new Promise((resolve, reject) => {
                commit('logout')
                localStorage.removeItem('user-token')
                delete axios.defaults.headers.common['Authorization']
                resolve()
                })
        },
      fetch_user_data({commit}) {
           let token = localStorage.getItem('user-token')
           let data = {'token': token}
           return new Promise((resolve, reject) => {
                commit('auth_request')
                axios.defaults.headers.common['Authorization'] = 'Token ' + token
                axios({url: 'http://localhost:6060/api/user_info/', data: data, method: 'POST' })
                .then(resp => {
                  commit('auth_success', {'token': token, 'user':resp.data.user})
                  resolve(resp)
                })
                .catch(err => {
                  commit('auth_error', err)
                  // localStorage.removeItem('user-token')
                  reject(err)
                })
              })
      }
  },
  getters : {
      isLoggedIn: state => !!state.token,
      authStatus: state => state.status,
  }
})