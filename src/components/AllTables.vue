<template>
    <div class="all-tables">
        <h2>Здесь будут все таблицы, созданные текущим пользователем</h2>
        <div style="text-align: center">
            <b-card v-for="table in all_author_tables" class="table-card">
                <b-card-title>
                    {{table.table_name}}
                </b-card-title>
               <b-card-body style="text-align: left">
                   Группа: {{table.table_group_number}} <br/>
                   Направление: <b>Нет Поля</b> <br/>
                   Дата создания: <b>Нет Поля</b> <br/>
                   Дата последнего редактирования: <b>Нет Поля</b> <br/>
               </b-card-body>
               <b-card-footer>
                   <b-btn squared variant="outline-secondary" small class="action-button" @click="edit_table(table.id)">Редактировать</b-btn>
                   <b-btn squared variant="outline-secondary" class="action-button" @click="delete_table(table.id)">Удалить</b-btn>
                   <b-btn squared variant="outline-secondary" class="action-button">Сохранить документ</b-btn>
               </b-card-footer>
            </b-card>
        </div>
    </div>

</template>

<script>
    import axios from 'axios'
    import store from '../store'
    import router from '../router/index'
    import TableEditView from "../views/TableEditView";

    export default {
        name: "AllTables",
        components: {
            TableEditView
        },
        data() {
            return{
                all_author_tables: '',
            }

        },
        methods: {
            fetch_tables_info: function () {
                let data = {'action': 'get_all', params: {'author-token': store.state.token}}
                axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.all_author_tables = resp.data.params.all_author_tables
                        // console.log(this.all_author_tables)
                    } else {
                        console.log('Ошибка при загрузке списка таблиц')
                    }
                })

            },
            edit_table: function (table_id) {
                store.state.selected_table_id = table_id
                router.push('/edit_table')
            },
            delete_table: function (table_id) {
                let data = {'action': 'delete_table', 'params': {'table_id': table_id}}
                axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.fetch_tables_info()
                        this.make_toast('Удаление', 'Таблица удалена')
                    }
                    else {
                        console.log(resp.data.params.message)
                    }
                })
            },
            make_toast: function (event_type, message, append=false) {
                this.$bvToast.toast(message, {
                    title: event_type,
                    autoHideDelay: 3000,
                    appendToast: append
                })
            },
        },
        created() {
            this.fetch_tables_info()
        }
    }
</script>

<style scoped>
    .table-card {
        width: 40vw;
        position: relative;
        margin: auto;
        margin-top: 30px;
    }
    .action-button {
        margin-right: 10px;
        margin-left: 10px;
    }
</style>