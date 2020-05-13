<template>
  <b-card v-bind:class="{'register-card-stud': status === 'student', 'register-card-teach': status === 'teacher'}">
    <b-card-title>
      <header class="">
          <p class="">Регистрация</p>
      </header>
      <b-card-sub-title v-if="error" class="error-subtitle">Ошибка. Проверьте введенные данные.</b-card-sub-title>
    </b-card-title>
    <b-card-body>
      <b-form-group label="Укажите статус:" style="text-align: left">
        <b-form-radio v-model="status" name="some-radios"  value="student">Студент</b-form-radio>
        <b-form-radio v-model="status" name="some-radios" value="teacher">Преподаватель</b-form-radio>
      </b-form-group>
      <b-form-input type="email" name="email" v-model="email" placeholder="Email" required class="mt-2" :state="states.email_state" @change="states.email_state = null"/>
      <b-form-input type="text" name="last_name" v-model="fio.last_name" placeholder="Фамилия" required class="mt-2" :state="states.fio_state" @change="states.fio_state = null"/>
      <b-form-input type="text" name="first_name" v-model="fio.first_name" placeholder="Имя" required class="mt-2" :state="states.fio_state" @change="states.fio_state = null"/>
      <b-form-input type="text" name="middle_name" v-model="fio.middle_name" placeholder="Отчество" required class="mt-2"></b-form-input>

      <template v-if="status === 'student'">
        <b-form-input type="text" name="ticket_number" v-model="ticket_number" placeholder="Номер студенческого билета" required class="mt-2"></b-form-input>
      </template>

      <template v-if="status === 'teacher'">
        <b-form-select v-model="teacher_faculty" class="mt-2" :state="states.faculty_state">
          <template v-slot:first>
            <b-form-select-option :value="''" disabled>-- Факультет --</b-form-select-option>
          </template>
          <b-form-select-option v-for="faculty in all_faculties" v-bind:value="faculty">{{ store.state.faculty_decryption[faculty.name] }}</b-form-select-option>
        </b-form-select>

        <b-form-group label="Преподаваемые направления" class="mt-2">
          <b-form-select v-model="selected_studying_directions" multiple :state="states.directs_state" :select-size="6" @change="states.directs_state = null">
            <b-form-select-option v-for="direction in teacher_faculty.directions_names_on_faculty" v-bind:value="direction.name ">
              {{store.state.direction_decryption[direction.name ]}}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </template>

      <b-form-input type="password" name="password" v-model="password" placeholder="Пароль" required class="mt-2" :state="states.passwords_state" @change="states.passwords_state = null"/>
      <b-form-input type="password" name="password2" v-model="password2" placeholder="Пароль (ещё раз)" required class="mt-2" :state="states.passwords_state" @change="states.passwords_state = null"/>
    </b-card-body>
    <b-card-footer>
      <b-button squared class="button is-primary" @click='register()'>Зарегистрироваться</b-button>
      <br/>
      Уже есть аккаунт? <b-link class="button is-primary" @click="$router.push({name: 'loginForm'})">Войти</b-link>
    </b-card-footer>
  </b-card>
</template>

<script>
    import axios from "axios";
    import router from "../router/index";
    import store from "../store";

    export default {
      name: "RegistrationForm",
      data: function () {
        return {
          store: store,
          status: '',
          // Common data
          email: '',
          fio: {first_name: '', middle_name: '', last_name: ''},
          password: '',
          password2: '',

          // Teacher data
          all_faculties: [],
          teacher_faculty: '',
          faculty_studying_directions: [],
          selected_studying_directions: [],

          // Student data
          ticket_number: '',

          // States
          states: {
            email_state: null,
            fio_state: null,
            thicket_number_state: null,
            faculty_state: null,
            directs_state: null,
            passwords_state: null,
            error: false,
            error_text: ''}
        }
      },
      methods: {
        register: function () {
          this.error = false
          for (let state in this.states) {
            state = null
          }
          if (this.email === '') this.states.email_state = false
          if (this.first_name === '' || this.last_name === '') this.states.fio_state = false
          if (this.password === '' || this.password2 === '') this.states.passwords_state = false
          if (this.password !== this.password2) this.states.passwords_state = false

          if (this.status === 'student') {
            if (this.ticket_number === '') this.states.thicket_number_state = false
          }
          if (this.status === 'teacher') {
           if (this.teacher_faculty === '') this.states.faculty_state = false
           if (this.selected_studying_directions === '') this.states.directs_state = false
          }
          for (let state in this.states) {
            if (state === false) {
              this.error = true
              return
            }
          }
          let new_user = {}
          if (this.status === 'student') {
            new_user = {
             email: this.email,
             first_name: this.fio.first_name,
             last_name: this.fio.last_name,
             middle_name: this.fio.middle_name,
             ticket_number: this.ticket_number,
             is_teacher: false,
             is_student: true,
             is_staff: false,
             password: this.password,
             password2: this.password2,
          }
          }
          if (this.status === 'teacher') {
            new_user = {
             email: this.email,
             first_name: this.fio.first_name,
             last_name: this.fio.last_name,
             middle_name: this.fio.middle_name,
             studying_directions: this.selected_studying_directions,
             is_teacher: true,
             is_student: false,
             is_staff: false,
             password: this.password,
             password2: this.password2,
          }
          }

          store.commit('auth_request')
          axios({url: 'http://localhost:6060/api/registration/', data: new_user, method: 'POST' })
          .then(resp => {
              if (resp.data.result === 'ok') {
                let user_info = {'token': resp.data.params.token, 'user': resp.data.params.user }
                localStorage.setItem('user-token', user_info['token'])
                axios.defaults.headers.common['Authorization'] = 'Token ' + resp.data.params.token
                store.commit('auth_success', user_info)
                router.push('/')
              }
              else {
               store.commit('auth_error', resp.data.result)
               localStorage.removeItem('user-token')
               this.error = true
              }
            })
        },
      },
      created: function () {
        this.status = 'student'
        axios.get('http://localhost:6060/api/faculties_and_directs')
          .then(resp => {
              if (resp.data.result === 'ok') {
                  this.all_faculties = resp.data.params.data
                }
                else {
                  console.log('Ошибка при загрузке данных факультетов')
                }
          }
        )
      }
    }
</script>

<style scoped>

  .register-card-teach {
    width: 470px;
    height: 800px;
    position: absolute;
    top: calc(50% - 400px);
    left: calc(50% - 200px);
  }
  .register-card-stud {
    width: 470px;
    height: 620px;
    position: absolute;
    top: calc(50% - 400px);
    left: calc(50% - 200px);
  }
  .register-card .error-subtitle {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 300px;
 }
</style>