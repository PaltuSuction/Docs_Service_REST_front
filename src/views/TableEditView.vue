<template>
    <div class="table-edit-view">
        <h2>Редактирование ведомости</h2>

        <div style="margin-top: 20px">
            <TableGenerator v-if="table_data !== ''" :table_data="table_data"/>
        </div>

    </div>

</template>

<script>
    import axios from "axios";
    import router from "../router/index";
    import store from "../store";
    import TableGenerator from "../components/TableGenerator";

    export default {
        name: "TableEditView",
        components: {
            TableGenerator
        },
        data() {
            return {
                store: store,
                table_id: '',
                table_data: ''
            }
        },
        methods: {

        },
        created() {
            this.table_id = store.state.selected_table_id
            axios({url: `http://localhost:6060/api/table_creator/${this.table_id}`, method: 'GET'})
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.table_data = resp.data.params.table_data
                    }
                    else {
                        console.log('Ошибка при получении данных таблицы')
                    }
                })
        }
    }

</script>

<style scoped>

</style>