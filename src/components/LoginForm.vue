<template>
  <div>
    <b-card class="login-card">
      <b-card-title>
        <header class="">
          <p>Вход</p>
        </header>
        <b-card-sub-title v-if="error" class="error-subtitle">Ошибка. Проверьте введенные данные.</b-card-sub-title>
      </b-card-title>
      <b-card-body>
        <b-form-input type="text" name="username" v-model="username" :state="username_state" @change="username_state = null" placeholder="№ Билета / Email" required></b-form-input>
        <b-form-input  type="password" name="password" v-model="password" :state="password_state" @change="password_state = null" placeholder="Пароль" required class="mt-3"/>
      </b-card-body>
      <b-card-footer>
        <b-button squared class="button is-primary" @click='login'>Войти</b-button>
        <br/>
        <b-link class="button is-primary" @click="$router.push({name: 'registrationForm'})">Регистрация</b-link>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
    import axios from 'axios'
    import router from "../router/index";
    import store from "../store";

    export default {
      data: function () {
        return {
          username: '',
          username_state: null,
          password: '',
          password_state: null,
          token: localStorage.getItem('user-token') || null,
          error: false
        }
      },
      methods: {
        login: async function () {
          this.error = false
          this.username_state = null
          this.password_state = null
          if (this.username === '') this.username_state = false
          else this.username_state = null
          if (this.password === '') this.password_state = false
          else this.password_state = null
          if (this.username_state === false || this.password_state === false) return

          let username = this.username
          let password = this.password
          axios({url: 'http://localhost:6060/auth/', data: {username, password}, method: 'POST'})
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
        },
      },
      created() {
        if (localStorage.getItem('user-token') !== null) {
          router.push({name: 'home'})
        }
      }
    }
</script>



<style scoped>
  .login-card {
    width: 400px;
    max-height: 300px;
    position: absolute;
    top: calc(50% - 150px);
    left: calc(50% - 200px);
  }
 .login-card .error-subtitle {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 300px; /* Need a specific value to work */
 }
</style>