<template>
  <b-card class="register-card">
    <b-card-title>
      <header class="">
          <p class="">Регистрация</p>
      </header>
      <b-card-sub-title v-if="error" class="error-subtitle">Ошибка. Проверьте введенные данные.</b-card-sub-title>
    </b-card-title>
    <b-card-body>
      <b-form-input type="email" name="email" v-model="email" placeholder="Email" required class="mt-2" :state="email_state" @change="email_state = null"/>
      <b-form-input type="text" name="last_name" v-model="fio.last_name" placeholder="Фамилия" required class="mt-2" :state="fio_state" @change="fio_state = null"/>
      <b-form-input type="text" name="first_name" v-model="fio.first_name" placeholder="Имя" required class="mt-2" :state="fio_state" @change="fio_state = null"/>
      <b-form-input type="text" name="middle_name" v-model="fio.middle_name" placeholder="Отчество" required class="mt-2"></b-form-input>

      <b-form-select v-model="teacher_faculty" class="mt-2" @change="set_study_directs" :state="faculty_state">
        <b-form-select-option v-for="faculty in all_faculties" v-bind:value="faculty">{{ store.state.faculty_decryption[faculty.name] }}</b-form-select-option>
      </b-form-select>

      <b-form-group label="Преподаваемые направления" class="mt-2">
        <b-form-select v-model="selected_studying_directions" multiple :state="directs_state" :select-size="6" @change="directs_state = null">
          <b-form-select-option v-for="direction_name in faculty_studying_directions" v-bind:value="direction_name">
            {{store.state.direction_decryption[direction_name]}}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>

      <b-form-input type="password" name="password" v-model="password" placeholder="Пароль" required class="mt-2" :state="passwords_state" @change="passwords_state = null"/>
      <b-form-input type="password" name="password2" v-model="password2" placeholder="Пароль (ещё раз)" required class="mt-2" :state="passwords_state" @change="passwords_state = null"/>
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
          email: '',
          fio: {first_name: '', middle_name: '', last_name: ''},
          all_faculties: [],
          teacher_faculty: '',
          faculty_studying_directions: [],
          selected_studying_directions: [],
          password: '',
          password2: '',
          is_teacher: true,
          is_student: false,
          is_staff: false,

          email_state: null,
          fio_state: null,
          faculty_state: null,
          directs_state: null,
          passwords_state: null,
          error: false,
          error_text: ''
        }
      },
      methods: {
        register: function () {
          this.error = false
          this.fio_state = this.email_state = this.faculty_state = this.directs_state = this.passwords_state = null
          if (this.first_name === '' || this.last_name === '') this.fio_state = false
          if (this.email === '') this.email_state = false
          if (this.teacher_faculty === '') this.faculty_state = false
          if (this.selected_studying_directions === '') this.directs_state = false
          if (this.password === '' || this.password2 === '') {
            this.passwords_state = false
          }
          if (this.password !== this.password2) {
            this.passwords_state = false
          }
          if (this.fio_state === false || this.email_state === false || this.faculty_state === false || this.directs_state === false || this.passwords_state === false) {
            this.error = true
            return
          }
          let new_user = {
             username: this.email,
             first_name: this.fio.first_name,
             last_name: this.fio.last_name,
             middle_name: this.fio.middle_name,
             studying_directions: this.selected_studying_directions,
             is_teacher: this.is_teacher,
             is_student: this.is_student,
             is_staff: this.is_staff,
             password: this.password,
             password2: this.password2,
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
                // resolve(resp)
              }
              else {
               store.commit('auth_error', resp.data.result)
               localStorage.removeItem('user-token')
               this.error = true
              }
            })
            // this.$store.dispatch('register', data)
        },
        set_study_directs: function () {
          this.faculty_state = null
           for (let direction of this.teacher_faculty.directions_names_on_faculty) {
            this.faculty_studying_directions.push(direction.name)
           }
        }
      },
      created: function () {
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

  .register-card {
    width: 470px;
    height: 700px;
    position: absolute;
    top: calc(50% - 325px);
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