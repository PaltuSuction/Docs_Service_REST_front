<template>
  <div class="table-create-view">
    <h2>Меню создания таблиц</h2>

      <div class="card">
         <div class="card-body">
             <b-form-group label="Укажите группу и название дисциплины">
                 <div class="row">
                     <div class="col-md-4">
                        <b-form-select id="discipline" class="mt-2" v-model="selected_direction" @change="fetch_groups">
                         <template v-slot:first>
                            <b-form-select-option :value="''" disabled>-- Направление подготовки --</b-form-select-option>
                         </template>
                         <b-form-select-option class="mt-2" v-for="direction in all_directions" :key="direction.name" v-bind:value="direction.name">
                             {{ $store.state.direction_decryption[direction.name] }}
                         </b-form-select-option>
                        </b-form-select>
                     </div>
                     <div class="col-md-4">
                         <b-form-select class="mt-2" id="discipline" v-model="selected_group">
                             <template v-slot:first>
                                <b-form-select-option :value="''" disabled>-- Группа --</b-form-select-option>
                             </template>
                             <b-form-select-option v-for="group_number in groups_on_direction" :key="group_number" v-bind:value="group_number">{{group_number}}</b-form-select-option>
                         </b-form-select>
                     </div>
                     <div class="col-md-4">
                         <b-input class="mt-2" placeholder="Название дисциплины" v-model="new_table_name"/>
                     </div>
                 </div>
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
                selected_group: '',
                students_in_selected_group: '',
                new_table_name: '',
                table_data: '',
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
                    params: {'group_number': this.selected_group, 'new_table_name': this.new_table_name}
                }
                axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST'})
                // .then(resp => (this.fetch_students_info(resp.data.params.students)))
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.table_data = resp.data.params.table_data
                        // console.log(this.table_data)
                    }
                })
                .catch(error =>(console.log(error)))
            },
        },
        created() {
             let data = {'action': 'get_directions'}
             axios({url: 'http://localhost:6060/api/table_creator/', data: data, method: 'POST'})
                .then(resp => (this.all_directions = resp.data.params.directions_names))
                .catch(error =>(console.log(error)))
        }
}
</script>

<style>

</style>
