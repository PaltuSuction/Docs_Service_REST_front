<template>
    <div class="profile-edit">
        <h2>Редактирование профиля</h2>
        <b-card style="text-align: left;">
            <b-card-title>
                {{store.state.user.last_name}} {{store.state.user.first_name}} {{store.state.user.middle_name}}
            </b-card-title>
            <b-card-sub-title v-if="store.state.user.is_teacher === true">
                Преподаватель
            </b-card-sub-title>
            <b-card-sub-title v-if="store.state.user.is_student === true">
                Группа {{user_data.group_number}}
            </b-card-sub-title>
            <b-card-body>
                <div v-if="store.state.user.is_teacher === true">
                    <p><b>Факультет: </b>
                        <b-form-select style="width: 10vw"  v-model="selected_faculty" class="mt-2">
                            <b-form-select-option v-for="faculty in user_data.all_faculties" v-bind:value="faculty">{{ store.state.faculty_decryption[faculty.name] }}</b-form-select-option>
                        </b-form-select>
                        <b-button squared variant="outline-dark" class="ml-3" v-if="selected_faculty !== ''" @click="selected_faculty = ''">Отменить</b-button>
                    </p>

                    <p><b>Преподаваемые направления: </b>
                        <b-form-group style="width: 22vw;" class="mt-2">
                            <b-form-select v-model="selected_studying_directions" multiple :select-size="6" @change="directs_state = null">
                                <b-form-select-option v-for="direction in selected_faculty.directions_names_on_faculty" v-bind:value="direction">
                                    {{store.state.direction_decryption[direction.name]}}
                                </b-form-select-option>
                            </b-form-select>
                        </b-form-group>
                    </p>
                    <b>Кафедры:</b> <span v-for="department in user_data.teacher_departments">{{ department }}; </span>
                        <b-form-input list="departments_list" class="mt-1" style="width: 22vw;" placeholder="Название кафедры" v-model="department_to_add_delete"/>
                        <datalist id="departments_list">
                            <option v-for="department in user_data.teacher_departments">{{ department }}</option>
                        </datalist>
                        <div style="margin-top: 1vh;">
                            <b-button variant="outline-dark" @click="add_department">Добавить</b-button>
                            <b-button class="ml-2" variant="outline-dark" @click="delete_department">Удалить</b-button>
                        </div>
                </div>

                <div v-if="store.state.user.is_student === true">
                    <p><b>Группа:</b> {{user_data.group_number}}</p>
                </div>

                <p class="mt-2"><b>Смена пароля</b>
                <b-form-group>
                    <b-form-input class="password-input" v-model="old_password" type="password" placeholder="Старый пароль"/>
                    <b-form-input class="password-input" v-model="new_password" type="password" placeholder="Новый пароль"/>
                    <b-form-input class="password-input" v-model="new_password_2" type="password" placeholder="Новый пароль (ещё раз)"/>
                    <b-button style="margin-top: 1vh;" squared variant="outline-dark" @click="password_change">Сменить пароль</b-button>
                </b-form-group>
                </p>
            </b-card-body>
            <b-card-footer v-if="store.state.user.is_teacher === true">
                <b-button squared variant="outline-dark" @click="save_changes">Сохранить именения</b-button>
            </b-card-footer>
        </b-card>
    </div>
</template>

<script>
    import axios from 'axios'
    import store from '../store'
    
    export default {
        name: "ProfileEditView",
        components: {

        },
        data() {
            return {
                store: store,
                user_data: '',
                selected_faculty: '',
                selected_studying_directions: '',

                department_to_add_delete: '',

                old_password: '',
                new_password: '',
                new_password_2: '',
            }
        },
        methods: {
            password_change: function () {
                let data = {'old_password': this.old_password, 'new_password': this.new_password, 'new_password_2': this.new_password}
                axios({url: 'http://localhost:6060/api/user_info/', data: data, method: 'PUT' })
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.make_toast('Обновление пароля', 'Пароль обновлен успешно')
                    }
                    else {
                        this.make_toast('Обновление пароля', `Ошибка: ${resp.data.params.message}`)
                    }
                })
            },
            add_department: function () {
                let data = {'action': 'add_department', 'params': {'department_name': this.department_to_add_delete}}
                axios({url: 'http://localhost:6060/api/user_info/', data: data, method: 'POST' })
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.user_data.teacher_departments = resp.data.params.teacher_departments
                    }
                })
            },
            delete_department: function () {
                let data = {'action': 'delete_department', 'params': {'department_name': this.department_to_add_delete}}
                axios({url: 'http://localhost:6060/api/user_info/', data: data, method: 'POST' })
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.user_data.teacher_departments = resp.data.params.teacher_departments
                    }
                })
            },
            save_changes: function () {
                let update_params = {}
                if (store.state.user.is_teacher) {
                    if (this.selected_faculty !== '' && this.selected_studying_directions === '') {
                        update_params = {'type': 'change_faculty', 'faculty_name': this.selected_faculty.name}
                    }
                    if (this.selected_studying_directions !== '') {
                         update_params = {'type': 'change_directions', 'directions_names': this.selected_studying_directions}
                    }
                    if (this.selected_faculty === '' && this.selected_studying_directions === '') {
                        this.make_toast('Редактирование профиля', 'Изменения сохранены')
                    }
                }
                let data = {'action': 'update_profile', 'params': update_params}
                axios({url: 'http://localhost:6060/api/user_info/', data: data, method: 'POST' })
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.make_toast('Редактирование профиля', 'Изменения сохранены')
                    }
                    else {
                        this.make_toast('Редактирование профиля', `Ошибка: ${resp.data.params.message}`)
                    }
                })

            },
            // Additional methods
            make_toast: function (event_type, message, append=false) {
                this.$bvToast.toast(message, {
                    title: event_type,
                    autoHideDelay: 3000,
                    appendToast: append
                })
            },
        },
        created() {
            let data = {'action': 'get_info_for_edit'}
            axios({url: 'http://localhost:6060/api/user_info/', data: data, method: 'POST' })
            .then(resp => {
                if (resp.data.result === 'ok') {
                    this.user_data = resp.data.params
                }
                else {
                    console.log(resp.data.params.message)
                }
            })
        }
    }
</script>

<style scoped>
    .password-input {
        width: 15vw;
        margin-top: 1vh;
    }
</style>