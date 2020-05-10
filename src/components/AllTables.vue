<template>
    <div class="all-tables">
        <h2>Здесь будут все таблицы, созданные текущим пользователем</h2>
        <div style="text-align: center">
            <b-card v-for="table in all_author_tables" class="table-card" :key="table.table_id">
                <b-card-title>
                    <b>{{table.table_name}}, группа {{table.table_group_number}}</b>
                </b-card-title>
               <b-card-body style="text-align: left">
                   Направление: <b>Нет Поля</b> <br/>
                   Дата создания: {{table.table_created_at}} <br/>
                   Дата последнего редактирования: {{table.table_updated_at}} <br/>
               </b-card-body>
               <b-card-footer>
                   <b-btn squared variant="outline-dark" class="action-button" @click="edit_table(table.id)">Редактировать</b-btn>
                   <b-btn squared variant="outline-dark" class="action-button" @click="delete_table(table.id)">Удалить</b-btn>
                   <b-btn squared variant="outline-dark" class="action-button" @click="create_document(table.id)">Скачать файл (.xls)</b-btn>
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
                all_author_tables: [],
            }
        },
        methods: {
            fetch_tables_info: function () {
                let data = {'action': 'get_all', params: {'author-token': store.state.token}}
                axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.all_author_tables = []
                        for (let table of resp.data.params.all_author_tables) {
                            let author_table = {}
                            author_table['id'] = table['id']
                            author_table['table_name'] = table['table_name']
                            author_table['table_group_number'] = table['table_group_number']
                            author_table['table_created_at'] = this.get_correct_date(table['table_created_at'])
                            author_table['table_updated_at'] = this.get_correct_date(table['table_updated_at'])
                            this.all_author_tables.push(author_table)
                        }
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
            create_document: function (table_id) {
                let data = {'action': 'create_document', 'params': {'table_id': table_id}}
                axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST', responseType: 'blob'})
                /* .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.make_toast('Создание документа', 'Документ создан успешно')
                    }
                    else {
                        this.make_toast('Создание документа', 'Ошибка при создании документа')
                    }
                }) */
                    .then(resp => {
                        console.log(resp)
                             var fileURL = window.URL.createObjectURL(new Blob([resp.data]));
                             var fileLink = document.createElement('a');
                             fileLink.href = fileURL;
                             fileLink.setAttribute('download', 'file.xls');
                             document.body.appendChild(fileLink);
                             fileLink.click();
                    })
                .catch(error => (console.log(error)))
            },
            // Additional methods
            get_correct_date: function (date_string) {
                 let dateObj = new Date(date_string)
                 let month = store.state.month_names[dateObj.getMonth()];
                 let day = String(dateObj.getDate()).padStart(2, '0');
                 let year = dateObj.getFullYear();
                 let hour = dateObj.getHours();
                 let minutes = String(dateObj.getMinutes()).padStart(2, '0')
                 return hour + ':' + minutes + ', ' + day + ' ' + month + ', ' + year
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