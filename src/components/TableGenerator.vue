<template>
    <div class="table-generator">
        <b-card class="mt-3">
            <b-card-body style="text-align: center">
                <b-form-group class="mb-3">
                    <b-form-select style="width: 14vw; display: inline" class="mr-3" v-model="choosed_column_type">
                        <template v-slot:first>
                            <b-form-select-option :value="''" disabled>-- Тип Контрольной точки --</b-form-select-option>
                        </template>
                        <b-form-select-option v-for="type in store.state.col_types" :key="type" v-bind:value="type">{{type}}</b-form-select-option>
                    </b-form-select>

                    <b-form-input style="width: 12vw; display: inline" v-model="custom_column_type" v-if="choosed_column_type === 'Свой вариант'" type='text' placeholder='Укажите свой вариант'/>

                    <b-form-select style="width: 16vw; display: inline" class="ml-3" v-model="choosed_calc_option" @change="calc_all_final_grades">
                        <template v-slot:first>
                            <b-form-select-option :value="''">-- Расчёт итоговой оценки (откл) --</b-form-select-option>
                        </template>
                        <b-form-select-option v-for="option in final_grade_calc_options" :key="option.value" v-bind:value="option.value">{{option.text}}</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group>
                    <b-button squared variant="outline-dark" @click="add_column" class="mr-3">Добавить столбец</b-button>
                    <b-button squared variant="outline-dark" @click="delete_column" class="mr-3">Удалить столбец</b-button>
                    <b-button squared variant="outline-dark" @click="save_table" class="mr-3">Сохранить таблицу</b-button>
                    <b-button squared variant="outline-dark" @click="create_document(table_id)" class="mr-3">Скачать файл (.xls)</b-button>
                </b-form-group>
            </b-card-body>
        </b-card>
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
                                        <div v-show="current_grade !== grade.id">
                                            <span @mouseenter="current_grade = grade.id" class="grade-span">{{grade.grade_value}}</span>
                                        </div>
                                        <b-input class="grade-input"
                                                 v-show="current_grade === grade.id"
                                                 v-model="grade.grade_value"
                                                 @change="student.grades['\u05C4Итог'][0].grade_value = final_grade_calc(student)"
                                                 @mouseleave="current_grade = ''"
                                                 @keyup.enter="current_grade = ''"/>
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
                choosed_column_type: '',
                custom_column_type: '',
                current_grade: '',
                final_grade_calc_options: [
                    {value: 'average', text: 'Средний балл'},
                    {value: 'sum', text: 'Сумма баллов'},
                ],
                choosed_calc_option: '',
                unfilled_as_zero: false
            }
        },
        methods: {
            add_column: function () {
                let _t = this

                if (_t.choosed_column_type === 'Свой вариант') {
                    if (_t.custom_column_type !== '') {
                        _t.selected_column_type = _t.custom_column_type
                    }
                }
                else {_t.selected_column_type = _t.choosed_column_type}

                for (let [key, value] of Object.entries(_t.grades_types)) {
                    if (key === this.selected_column_type) {
                        _t.grades_types[key] +=1
                    }
                }
                if (_t.grades_types[_t.selected_column_type] === undefined) {
                    _t.$set(_t.grades_types, _t.selected_column_type, 1)

                    let ordered_types = {}
                    Object.keys(_t.grades_types).sort().forEach(function(key) {
                        ordered_types[key] = _t.grades_types[key];
                    })
                    _t.grades_types = ordered_types
                    /*
                    let students_with_sorted_grades = []
                    for (let student of this.students) {
                        let ordered_types_for_student = {}
                        Object.keys(student.grades).sort().forEach(function(key) {
                        ordered_types_for_student[key] = student.grades[key];
                        })
                        student.grades = ordered_types_for_student
                        students_with_sorted_grades.push(student)
                    }
                    this.students = students_with_sorted_grades
                    */
                }

                let data = {action: 'add_column', params: {table_id: _t.table_id, column_type: _t.selected_column_type}}
                axios({url: `http://localhost:6060/api/table_creator/`, data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        let new_grades = resp.data.params.new_grades
                        for (let student of _t.students) {
                            if (!(_t.selected_column_type in student.grades)) {
                                _t.$set(student.grades, _t.selected_column_type, [])
                            }
                            student.grades[_t.selected_column_type].push(new_grades[student.id])
                            //
                            let students_with_sorted_grades = []
                            for (let student of this.students) {
                                let ordered_types_for_student = {}
                                Object.keys(student.grades).sort().forEach(function(key) {
                                ordered_types_for_student[key] = student.grades[key];
                                })
                                student.grades = ordered_types_for_student
                                students_with_sorted_grades.push(student)
                            }
                            this.students = students_with_sorted_grades
                            //
                        }
                    }
                    else {
                        console.log(resp.data.params.message)
                    }
                })
            },
            delete_column: function () {
                var _t = this

                if (_t.choosed_column_type === 'Свой вариант') {
                    if (_t.custom_column_type !== '') {
                        _t.selected_column_type = _t.custom_column_type
                    }
                }
                else {_t.selected_column_type = _t.choosed_column_type}

                if (_t.selected_column_type in _t.grades_types) {
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
                            for (let [key, value] of Object.entries(_t.grades_types)) {
                                if (key === _t.selected_column_type) {
                                    _t.grades_types[key] -=1
                                    if (_t.grades_types[key] <= 0) {
                                        delete _t.grades_types[key]
                                    }
                                }
                            }
                        }
                        else {
                            console.log(resp.data.params.message)
                        }
                    })
                }
            },
            final_grade_calc: function (student) {
              if (this.choosed_calc_option === '') {return student.grades['\u05C4Итог'][0].grade_value}
              let final_grade = 0
              let grades_count = 0
              for (let [grade_type, grades_array] of Object.entries(student.grades)) {
                  for (let grade of grades_array) {
                      if (grade.grade_value !== null && grade.grade_value !== '' && grade_type !== '\u05C4Итог') {
                         let grade_int = Number.parseInt(grade.grade_value)
                         final_grade += grade_int
                         grades_count +=1
                      }
                  }
              }
              if (this.choosed_calc_option === 'average') {final_grade = Math.round(final_grade / grades_count)}
              if (this.choosed_calc_option === 'sum') {}

              return isNaN(final_grade) ? 0 : final_grade
            },
            calc_all_final_grades: function() {
              if (this.choosed_calc_option !== '') {
                for (let student of this.students) {
                  student.grades['\u05C4Итог'][0].grade_value = this.final_grade_calc(student)
                }
              }
            },
            save_table: function() {
                let all_grades = {}
                for (let student of this.students) {
                    for (let type in student.grades) {
                        for (let grade of student.grades[type])
                        all_grades[grade.id] = grade.grade_value
                    }
                }
              let data = {action: 'save_table', params: {table_id: this.table_id, all_grades: all_grades}}
              axios({url: `http://localhost:6060/api/table_creator/`, data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.make_toast('Сохранение', 'Таблица сохранена')
                    }
                    else {
                        this.make_toast('Сохранение', 'Ошибка при сохранении')
                        console.log(resp.data.params.message)
                    }
                })

            },
            create_document: function (table_id) {
                this.save_table()
                let data = {'action': 'create_document', 'params': {'table_id': table_id}}
                axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST', responseType: 'blob'})
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
            //additional functions
            compare_grades: function (a, b) {
                if (a.grade_type < b.grade_type)
                    return -1
                if (a.grade_type > b.grade_type)
                    return 1
                return 0
            },
            make_toast: function (event_type, message, append=false) {
                this.$bvToast.toast(message, {
                    title: event_type,
                    autoHideDelay: 5000,
                    appendToast: append
                })
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

    .grade-span {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 25px;
    }

    .grade-input {
        position: center;
        width: 50px;
        height: 25px;
    }
</style>