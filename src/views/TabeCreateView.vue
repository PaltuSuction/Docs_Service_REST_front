<template>
  <div class="table-create-view">
    <h2>Меню создания таблиц</h2>

      <div class="card">
         <div class="card-body">
             <b-form-group label="Укажите группу и название дисциплины" class="mt-2 creation-settings-form">
                 <div class="row">
                     <b-form-select id="discipline" v-model="selected_direction" class="creation-select-direct mt-2" @change="fetch_groups">
                         <template v-slot:first>
                            <b-form-select-option :value="''" disabled>-- Направление подготовки --</b-form-select-option>
                         </template>
                         <b-form-select-option v-for="direction in all_directions" v-bind:value="direction.name">
                             {{ $store.state.direction_decryption[direction.name] }}
                         </b-form-select-option>
                     </b-form-select>
                     <b-form-select id="discipline" v-model="selected_group" class="tablegen-select-group mt-2">
                         <template v-slot:first>
                            <b-form-select-option :value="''" disabled>-- Группа --</b-form-select-option>
                         </template>
                        <b-form-select-option v-for="group_number in groups_on_direction" v-bind:value="group_number">{{group_number}}</b-form-select-option>
                     </b-form-select>
                    <b-input class="tablegen-input-name mt-2" placeholder="Название дисциплины" v-model="new_table_name"/>
                 </div>
                 <b-button secondary type="submit" value="Создать" class="mt-2" @click="create_table">Создать таблицу</b-button>
             </b-form-group>
         </div>
      </div>

        Генератор находится здесь
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
    .creation-settings-form {
        text-align: center;
    }
    .creation-select-direct {
        width: 28vw;
        margin-left: 5px;
        margin-right: 5px;
    }
    .tablegen-select-group {
        width: 10vw;
        margin-left: 5px;
        margin-right: 5px;
    }
    .tablegen-input-name {
        width: 15vw;
        margin-left: 5px;
        margin-right: 5px;
    }
    .scores-table {
        margin-top: 15px;
    }
</style>
