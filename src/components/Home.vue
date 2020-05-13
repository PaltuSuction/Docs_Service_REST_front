<template>
    <div class="container-fluid">
        <div class="wrapper">
            <div class="row">
                <div class="col-md-2">
                    <b-sidebar
                            title="JOnline 1.0"
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
                        <nav class="mt-3">
                            <b-nav vertical style="text-align: center">
                             <b-card-title class="">{{store.state.user.last_name}} {{store.state.user.first_name}} {{store.state.user.middle_name}} </b-card-title>
                                <b-card-sub-title v-if="store.state.user.is_teacher === true">Преподаватель</b-card-sub-title>
                                <b-card-sub-title v-if="store.state.user.is_student === true">Студент</b-card-sub-title>
                                <b-card-sub-title v-if="store.state.user.is_staff === true">Администратор</b-card-sub-title>
                                <div class="all-nav-links mt-3">
                                    <b-nav-item v-if="store.state.user.is_teacher === true" router-link to="/create_table" class="border-bottom mt-3">
                                        <div class="nav-item">Новая ведомость</div>
                                    </b-nav-item>
                                    <b-nav-item v-if="store.state.user.is_teacher === true" router-link to="/all_tables" class="border-bottom mt-3">
                                        <div class="nav-item">Созданные ведомости</div>
                                    </b-nav-item>
                                    <b-nav-item v-if="store.state.user.is_student === true" router-link to="/group_tables" class="border-bottom mt-3">
                                        <div class="nav-item">Ведомости группы</div>
                                    </b-nav-item>
                                    <b-nav-item v-if="store.state.user.is_teacher === true || store.state.user.is_student === true" router-link to="/profile_edit" class="border-bottom mt-3">
                                        <div class="nav-item">Редактирование профиля</div>
                                    </b-nav-item>
                                    <b-nav-item v-if="store.state.user.is_student !== true" router-link to="/admin_functions" class="border-bottom mt-3">
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