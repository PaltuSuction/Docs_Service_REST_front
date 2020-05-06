<template>
    <div class="table-generator">
        <p>GENERATOR PLACEHOLDER</p>
        <b-card>
            <b-card-body>
                <b-form-group>
                    <b-form-select v-model="selected_column_type" style="width: 14vw">
                         <b-form-select-option v-for="type in store.state.col_types" v-bind:value="type">{{type}}</b-form-select-option>
                    </b-form-select>
                    <b-button squared variant="outline-dark" @click="add_column" class="ml-3">Добавить столбец</b-button>
                    <b-button squared variant="outline-dark" @click="delete_column" class="ml-3">Удалить столбец</b-button>
                    <b-button squared variant="outline-dark" @click="" class="ml-3">Сохранить таблицу</b-button>
                </b-form-group>
            </b-card-body>
        </b-card>
        <b-card>
            <b-card-body>
                <div class="table-wrapper">
                    <!--
                    <table border="1">
                        <thead>
                        <tr>
                            <th rowspan="2">
                                ФИО
                            </th>
                            <th v-for="grade_type in table.grade_types" :colspan="grade_type.num" :key="grade_type.name">
                                {{grade_type.name}}
                            </th>
                        </tr>
                        <tr>
                            <template v-for="grade_type in table.grade_types">
                                <td v-for="n in grade_type.num">
                                    # {{n}}
                                </td>
                            </template>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="student in table.group_info" rowspan="2">
                                <td>
                                     {{student.fio}}
                                </td>
                                <template v-for="grade_type in student.grades">
                                    <td v-for="grade in grade_type">
                                        <div v-show="student.edit !== grade">
                                            <label @dblclick="student.edit = grade">{{grade}}</label>
                                        </div>
                                        <input name="grade"
                                               v-show = "student.edit === grade"
                                               v-model="placeholder_change"
                                               v-on:blur="student.edit = ''"
                                               @keyup.enter="student.edit = ''"/>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                    -->
                    <!--
                    <table border="1">
                        <thead>
                        <tr>
                            <td v-for="(value, key) in table_2[0]">
                                {{key}}
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="student_data in table_2">
                                <td v-for="(value, key) in student_data">
                                    <div v-show="student_data.edit !== key">
                                        <label @dblclick="student_data.edit = key"> {{value}}</label>
                                    </div>
                                    <input class="grade-input" name="key"
                                    v-show="student_data.edit === key"
                                    v-model = "student_data[key]"
                                    v-on:blur="student_data.edit = ''"
                                    @keyup.enter = "student_data.edit = ''"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    -->
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
                               <td class="table-fio-cell">
                                    {{student.fio}}
                               </td>
                                <template v-for="grade_type in student.grades">
                                    <td v-for="grade in grade_type">
                                        {{grade.grade_value}}
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
    import axios from 'axios'
    import store from '../store'

    export default {
        name: "TableGenerator",
        components: {},
        props: ['table_data'],
        data() {
            return {
                store: store,
                table_id: '',
                students: '',
                grades_types: '',
                selected_column_type: '',
                // Тестовые переменные
                /* table: {
                    grade_types: [{'name': 'Лабораторная работа','num': 4},
                                  {'name': 'Тест','num': 3},
                                  {'name': 'Итог','num': 1}],
                    group_info: {
                        'student_1' : {
                            fio: 'Ф И О 1',
                            grades: {
                                'lab': [4, 5, 5, 5],
                                'test': [3, 4, 4],
                                'fin': [0]
                            },
                            edit: undefined
                        },
                        'student_2' : {
                            fio: 'Ф И О 2',
                            grades: {
                                'lab': [4, 3, 4, 5],
                                'test': [4, 4, 5],
                                'fin': [0]
                            },
                            edit: undefined
                        }
                    }
                },
                table_2: [
                    {'fio': 'ФИО1', 'lab1': '3', 'lab2': '4', 'lab3': '3', 'test1': '5', 'test2': '5', 'edit': undefined},
                    {'fio': 'ФИО2', 'lab1': '3', 'lab2': '3', 'lab3': '5', 'test1': '3', 'test2': '5', 'edit': undefined},
                    {'fio': 'ФИО3', 'lab1': '5', 'lab2': '4', 'lab3': '3', 'test1': '5', 'test2': '4', 'edit': undefined},
                ] */
            }
        },
        methods: {
            add_column: function () {
                let _t = this
                for (let [key, value] of Object.entries(_t.grades_types)) {
                    if (key === this.selected_column_type) {
                        _t.grades_types[key] +=1
                    }
                    // console.log(key, value)
                }
                if (_t.grades_types[_t.selected_column_type] === undefined) {
                    // _t.grades_types[_t.selected_column_type] = 1
                    _t.$set(_t.grades_types, _t.selected_column_type, 1)
                }
                let data = {action: 'add_column', params: {table_id: _t.table_id, column_type: _t.selected_column_type}}
                axios({url: `http://localhost:6060/api/table_creator/`, data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        let new_grades = resp.data.params.new_grades
                        for (let student of _t.students) {
                            if (!(_t.selected_column_type in student.grades)) {
                                // student.grades[_t.selected_column_type] = []
                                _t.$set(student.grades, _t.selected_column_type, [])
                            }
                            student.grades[_t.selected_column_type].push(new_grades[student.id])
                        }
                    }
                    else {
                        console.log(resp.data.params.message)
                    }
                })

                /*for (let student of this.students) {
                    student.grades[this.selected_column_type].push({grade_type: this.selected_column_type, grade_value: null})
                    student.grades[this.selected_column_type].sort(this.compare_grades)
                } */
            },
            delete_column: function () {
                var _t = this
                if (_t.selected_column_type in _t.grades_types) {
                     for (let [key, value] of Object.entries(_t.grades_types)) {
                        if (key === _t.selected_column_type) {
                            _t.grades_types[key] -=1
                            if (_t.grades_types[key] <= 0) {
                                delete _t.grades_types[key]
                            }
                        }
                    }
                     let deleted_grades_ids = []
                     for (let student of _t.students) {
                         let last_grade_in_type = student.grades[_t.selected_column_type][student.grades[_t.selected_column_type].length - 1]
                         let last_grade_in_type_id = last_grade_in_type.id
                         deleted_grades_ids.push(last_grade_in_type_id)
                     }
                     let data = {action: 'delete_column', params: {table_id: _t.table_id, grades_ids: deleted_grades_ids}}
                     axios({url: `http://localhost:6060/api/table_creator/`, data: data, method: 'POST'})
                    .then(resp => {
                        if (resp.data.result === 'ok') {
                            for (let student of _t.students) {
                                student.grades[_t.selected_column_type].pop()
                                if (student.grades[_t.selected_column_type] <= 0) delete student.grades[_t.selected_column_type]
                            }
                        }
                        else {
                            console.log(resp.data.params.message)
                        }
                    })
                }
            },
            //additional functions
            compare_grades: function (a, b) {
                if (a.grade_type < b.grade_type)
                    return -1
                if (a.grade_type > b.grade_type)
                    return 1
                return 0
            }
        },
        created() {
            this.table_id = this.table_data.id
            this.students = this.table_data.students_and_grades
            this.grades_types = this.table_data.grades_types
        }
    }


</script>

<style scoped>
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
    table {
        overflow: hidden;
    }
    tr:hover {
        background-color: #e4fffa;
    }

    td:hover::after,
    th:hover::after {
      content: "";
      position: absolute;
      left: 0;
      top: -5000px;
      height: 100px;
      width: 100%;
      z-index: -1;
    }
</style>