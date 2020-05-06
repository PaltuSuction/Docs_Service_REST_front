<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'app',
        data: function () {
            // this.is_logged_in()
            return {
                current_user: {},
            }
        },
        components: {

        },
        methods: {

        },
        created: function () {
            if (localStorage.getItem('user-token')) {
                this.$store.dispatch('fetch_user_data')
            }
        },
        computed : {
            isLoggedIn : function() {
                return this.$store.getters.isLoggedIn
            }
        },
    }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
