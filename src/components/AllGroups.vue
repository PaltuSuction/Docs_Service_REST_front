<template>
    <div>
      <div v-for="group in groups">
          Номер группы: {{group.number}}
          Студенты группы:
          <div v-for="student in group.students_in_group">
              {{ student.last_name }} {{ student.first_name }} {{ student.middle_name }}
          </div>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

export default {
    name: 'AllGroups',
    components: {

    },
    data() {
      return {
          students: [],
          groups: [],
      }
    },
    methods: {
      StudentDetails(student) {
        this.studentdetail = student
      }
    },
    created() {
         axios.get(("http://localhost:6060/api/groups"))
          .then(res => (this.groups = res.data))
          .catch(err => console.log(err));
    }
}
</script>

<style>
    .nav-menu {
        background-color: lightgrey;
        color: black;
    }
    .nav-menu-item {
        color: white;
    }
</style>
