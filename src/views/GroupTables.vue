<template>
  <div class="all-groups">
    <h2>Ведомости группы {{student_group_number}}</h2>

    <div style="text-align: center">
            <b-card v-for="table in all_group_tables" class="table-card" :key="table.id" @click="view_table_instance(table.id)">
                <b-card-title>
                    {{table.table_name}}
                </b-card-title>
               <b-card-body style="text-align: left">
                    <p><b>Преподаватель: </b> {{table.table_teacher.last_name}} {{table.table_teacher.first_name}} {{table.table_teacher.middle_name}}</p>
                    <p><b>Последнее изменение: </b> {{table.table_updated_at}} </p>
               </b-card-body>
            </b-card>
        </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import store from "../store";
import router from "../router";
export default {
    name: 'GroupTables',
    components: {

    },
    data() {
      return {
          store: store,
          student_group_number: '',
          all_group_tables: [],
      }
    },
    methods: {
        // Additional_methods
        get_correct_date: function (date_string) {
            let dateObj = new Date(date_string)
            let month = store.state.month_names[dateObj.getMonth()];
            let day = String(dateObj.getDate()).padStart(2, '0');
            let year = dateObj.getFullYear();
            let hour = dateObj.getHours();
            let minutes = String(dateObj.getMinutes()).padStart(2, '0')
            return hour + ':' + minutes + ', ' + day + ' ' + month + ', ' + year
        },
        view_table_instance: function (table_id) {
            store.state.selected_table_id = table_id
            router.push('/group_table_instance')
        },
    },
    created() {
        let data = {'action': 'get_all_group_tables'}
        axios({url: 'http://localhost:6060/api/table_viewer/', data: data, method: 'POST'})
        .then(resp => {
            if (resp.data.result === 'ok') {
                this.student_group_number = resp.data.params.group_number
                this.all_group_tables = []
                for (let table of resp.data.params.all_group_tables) {
                    let group_table = {}
                    group_table['id'] = table['id']
                    group_table['table_name'] = table['table_name']
                    group_table['table_teacher'] = table['table_teacher']
                    group_table['table_updated_at'] = this.get_correct_date(table['table_updated_at'])
                    this.all_group_tables.push(group_table)
                }
            }
        })
    }
}
</script>

<style>
    .table-card {
        width: 30vw;
        position: relative;
        margin: auto;
        margin-top: 30px;
    }
</style>
