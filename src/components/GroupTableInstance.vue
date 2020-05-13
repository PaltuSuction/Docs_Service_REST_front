<template>
    <div class="table-instance-viewer">
        <h2>{{table_name}}</h2>
        <b-card class="mt-1">
            <b-card-body>
                <div class="table-wrapper">
                    <table border="2" style="margin: auto" ref="grades_table">
                        <thead>
                            <tr>
                                <th rowspan="2">
                                    ФИО
                                </th>
                                <th v-for="(num, name) in grades_types" :key="name" :colspan="num" class="table-head-cell">
                                    {{name}}
                                </th>
                            </tr>
                            <tr>
                                <template v-for="(num, name) in grades_types">
                                    <th v-for="n in num" class="table-grade-cell">
                                        № {{n}}
                                    </th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="student in students">
                               <td class="table-fio-cell" align="left">
                                    {{student.fio}}
                               </td>
                                <template v-for="grade_type in student.grades">
                                    <td v-for="grade in grade_type">
                                        <span class="grade-span">{{grade.grade_value}}</span>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import store from "../store";

export default {
    name: 'AllGroups',
    components: {

    },
    data() {
      return {
        store: store,
        table_name: '',

        table_id: '',
        students: '',
        grades_types: '',
      }
    },
    methods: {

    },
    created() {
        let data = {'action': 'get_group_table_instance', 'params': {'table_id': store.state.selected_table_id}}
        axios({url: 'http://localhost:6060/api/table_viewer/', data: data, method: 'POST'})
        .then(resp => {
            if (resp.data.result === 'ok') {
                this.table_name = resp.data.params.table_data.table_name
                this.table_id = resp.data.params.table_data.id
                this.students = resp.data.params.table_data.students_and_grades
                this.grades_types = resp.data.params.table_data.grades_types
            }
            else {
                console.log(resp.data.params.message)
            }
        })
    }
}
</script>

<style>
    .table-wrapper {
        margin-top: 30px;
    }
    .table-grade-cell {
        min-width: 50px;
    }
    .table-head-cell {
        padding: 5px;
    }
    .table-fio-cell {
        padding-left: 5px;
        padding-right: 5px;
    }
</style>
