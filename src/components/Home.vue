<template>
    <div class="container-fluid">
        <div class="wrapper">
            <div class="row">
                <div class="col-md-2">
                    <b-sidebar
                            title="Docs Service v0.1 REST"
                            visible="true"
                            no-slide
                            no-close-on-esc
                            no-close-on-backdrop
                            no-close-on-route-change
                            no-header-close
                            shadow
                            bg-variant="light"
                            body-class="sidebar-body"
                            width="20%"
                    >
                        <nav class="mb-5">
                            <b-nav vertical style="text-align: center">
                             <p>{{store.state.user.last_name}} {{store.state.user.first_name}} {{store.state.user.middle_name}} </p>
                                <p v-if="store.state.user.is_teacher === true">Преподаватель</p>
                                <p v-if="store.state.user.is_student === true">Студент</p>
                                <p v-if="store.state.user.is_staff === true">Администратор</p>
                                <div class="all-nav-links">
                                    <b-nav-item v-if="store.state.user.is_teacher === true" router-link to="/create_table" class="border-bottom mt-3">
                                        <div class="nav-item">Генератор таблиц</div>
                                    </b-nav-item>
                                    <b-nav-item v-if="store.state.user.is_teacher === true" router-link to="/all_tables" class="border-bottom mt-3">
                                        <div class="nav-item">Список созданных таблиц</div>
                                    </b-nav-item>
                                     <b-nav-item v-if="store.state.user.is_teacher === true || store.state.user.is_student === true" router-link to="" class="border-bottom mt-3">
                                         <div class="nav-item">Редактирование профиля</div>
                                     </b-nav-item>
                                     <b-nav-item v-if="store.state.user.is_student === true" router-link to="/group_tables" class="border-bottom mt-3">
                                         <div class="nav-item">Ведомости группы</div>
                                     </b-nav-item>
                                     <b-nav-item router-link to="/admin_functions" class="border-bottom mt-3">
                                         <div class="nav-item">Загрузка данных факультетов</div>
                                     </b-nav-item>
                                     <b-nav-item v-on:click="logout" class="border-bottom mt-3">
                                         <div class="nav-item">Выйти</div>
                                     </b-nav-item>
                                </div>
                            </b-nav>
                        </nav>
                    </b-sidebar>
                </div>
                <div class="col-md-10" style="text-align: center">
                  <b-container>
                      <router-view/>
                  </b-container>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import store from '../store'

    export default {
        name: 'Home',
        data: function () {
            return {
                store: store,
            }
        },
        components: {

        },
        methods: {
            logout: function () {
                this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push('/login')
                })
            }
        },
    }
</script>

<style scoped>
    .all-nav-links {
        text-align: left;
    }
    .nav-item {
        color: #323232;
    }
</style>