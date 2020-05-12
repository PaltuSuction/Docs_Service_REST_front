<template>
  <div class="all-groups">
    <h2>Ведомости группы {{table.table_group_number}}</h2>

    <div style="text-align: center">
            <b-card v-for="table in all_group_tables" class="table-card" :key="table.table_id">
                <b-card-title>
                    <b>{{table.table_name}}</b>
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
// @ is an alias to /src
import GroupTableInstance from "../components/GroupTableInstance";

export default {
  name: 'GroupTables',
  components: {

  }
}
</script>
