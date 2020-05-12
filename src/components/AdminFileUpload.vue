<template>
    <div class="admin-file-upload">
        <div class="card">
            <div class="card-body" style="text-align: center">
                <b-row align-h="around">
                    <b-col md="3">
                        <b-form-select v-model="faculty_name">
                            <template v-slot:first>
                                    <b-form-select-option :value="''" disabled>-- Факультет --</b-form-select-option>
                            </template>
                            <b-form-select-option class="" v-for="faculty in all_faculties" :key="faculty" v-bind:value="faculty">{{ store.state.faculty_decryption[faculty] }}</b-form-select-option>
                        </b-form-select>
                    </b-col>
                    <b-col md="7">
                        <b-form-file v-model="file" :state="Boolean(file)" placeholder="Выберите или перетащите файл" drop-placeholder="Перетащите файл сюда"></b-form-file>
                    </b-col>
                    <b-col md="2">
                        <b-button class="" squared variant="outline-dark" v-on:click="submitFile()">Загрузить</b-button>
                    </b-col>
                </b-row>
                <br/>
                <!--
                <label>Выберите файл для загрузки:
                    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" enctype="multipart/form-data"/>
                </label>
                -->
                <b>Уже имеющиеся в базе данных факультеты:</b>
                <br/>
                <div v-for="faculty in already_loaded_faculties">
                    <p v-if="faculty.excel_file"><b>{{ store.state.faculty_decryption[faculty.name] }}:</b> Файл загружен.
                        <b-button squared variant="outline-dark" v-on:click="parseFile(faculty.name)">
                            Обработать файл
                        </b-button>
                    </p>
                    <p v-else><b>{{ store.state.faculty_decryption[faculty.name] }}:</b> Файл не загружен.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    import store from "../store"

    export default {
        name: "AdminFileUpload",
        data() {
            return {
                store: store,
                all_faculties: ['FKTI', 'INPROTECH', 'FRT', 'FEL', 'IFIO', 'FEA', 'FIBS', 'GF', 'RY'],
                file: '',
                faculty_name: '',
                already_loaded_faculties: [],
            }
        },
        methods: {
            handleFileUpload: function () {
                this.file = this.$refs.file.files[0];
            },
            submitFile: function () {
                let formData = new FormData();
                formData.append('name', this.faculty_name);
                formData.append('excel_file', this.file);
                axios.post( 'http://localhost:6060/api/faculties/', formData,
                  { headers: {'Content-Type': 'multipart/form-data' }
                        })
                    .then(resp => (this.get_already_loaded()))
                    .catch(err => console.log(err));
            },
            parseFile: function (faculty_name) {
                axios.post(`http://localhost:6060/api/parse_file/`,
                    {
                        'faculty_name': faculty_name
                    })
                .then(succ => {
                    console.log('Запрос на парсинг отправлен');
                })
                .catch(err => console.log(err))
            },
            get_already_loaded: function () {
                axios.get(("http://localhost:6060/api/faculties"))
                .then(resp => {
                    if (resp.data.result === 'ok') {
                        this.already_loaded_faculties = resp.data.params.faculties
                    }
                    else {
                        console.log(resp.data.params.message)
                    }
                })
            },
        },
        created() {
            this.get_already_loaded()
        }
    }
</script>

<style scoped>
    .faculty-select-form {
        width: 15%;
    }
    .file-upload-form {
        width: 50%;
    }
</style>