<template>
  <div class="table-create-view">
    <h2>Создание ведомости</h2>
      <div class="card">
         <div class="card-body">
             <b-form-group label="Выберите направление подготовки, затем группу">
                 <b-row align-h="center">
                     <b-col md="4" class="mr-2">
                        <b-form-select id="discipline" class="mt-2" v-model="selected_direction" @change="fetch_groups">
                         <template v-slot:first>
                            <b-form-select-option :value="''" disabled>-- Направление подготовки --</b-form-select-option>
                         </template>
                         <b-form-select-option class="mt-2" v-for="direction in all_directions" :key="direction.name" v-bind:value="direction.name">
                             {{ $store.state.direction_decryption[direction.name] }}
                         </b-form-select-option>
                        </b-form-select>
                     </b-col>
                     <b-col md="4" class="ml-2">
                         <b-form-select class="mt-2" id="discipline" v-model="selected_group">
                             <template v-slot:first>
                                <b-form-select-option :value="''" disabled>-- Группа --</b-form-select-option>
                             </template>
                             <b-form-select-option v-for="group_number in groups_on_direction" :key="group_number" v-bind:value="group_number">{{group_number}}</b-form-select-option>
                         </b-form-select>
                     </b-col>
                 </b-row>
                 </b-form-group>
             <b-form-group label="Или сразу введите номер группы">
                 <b-row align-h="center">
                     <b-col md="3" class="mr-2">
                         <b-form-input list="groups_list" class="mt-2" placeholder="Номер группы" v-model="selected_group"/>
                     </b-col>
                     <datalist id="groups_list">
                        <option v-for="group_number in group_numbers">{{ group_number }}</option>
                     </datalist>

                     <b-col md="3" class="mr-2">
                         <b-form-input list="departments_list" class="mt-2" placeholder="Кафедра" v-model="table_department"/>
                     </b-col>
                     <datalist id="departments_list">
                        <option v-for="department_name in teacher_departments">{{ department_name }}</option>
                     </datalist>

                     <b-col md="3" class="ml-2">
                         <b-input class="mt-2" placeholder="Название дисциплины" v-model="new_table_name"/>
                     </b-col>
                 </b-row>
                 <b-button squared secondary type="submit" value="Создать" class="mt-2" @click="create_table">Создать таблицу</b-button>
             </b-form-group>
         </div>
      </div>

        <TableGenerator v-if="table_data !== ''" :table_data="table_data"/>

  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import router from "../router/index";
import store from "../store";
import TableGenerator from "../components/TableGenerator";

export default {
  name: 'TableCreateView',
  components: {
    TableGenerator
  },
  data() {
            return {
                store:store,
                all_directions: '',
                selected_direction: '',
                groups_on_direction: [],
                group_numbers: '',
                selected_group: '',
                students_in_selected_group: '',
                new_table_name: '',
                table_data: '',

                teacher_departments: [],
                table_department: '',
            }
        },
        methods: {
            fetch_groups: function () {
                // data = {'studying_direction': this.studying_direction}
                axios.get(`http://localhost:6060/api/groups_by_direct/${this.selected_direction}/`)
                .then(resp => (this.groups_on_direction = resp.data.params.groups_numbers))
                .catch(error => (console.log(error)))
            },
            create_table: function() {
                let data = {'action': 'create_new',
                    params: {'group_number': this.selected_group, 'new_table_name': this.new_table_name, 'table_department': this.table_department}
                }
                axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.table_data = resp.data.params.table_data
                    }
                })
                .catch(error =>(console.log(error)))
            },
        },
        created() {
             let data = {'action': 'get_directs_and_departments'}
             axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.all_directions = resp.data.params.directions_names
                        this.group_numbers = resp.data.params.all_group_numbers
                        this.teacher_departments = resp.data.params.teacher_departments
                    }
                    else {
                       console.log(resp.data.params.message)
                    }
                }
                )
                .catch(error =>(console.log(error)))
        }
}
</script>

<style>

</style>
