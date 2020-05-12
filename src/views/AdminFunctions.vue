<template>
  <div class="admin-functions">
    <h2>Администрирование</h2>
      <AdminFileUpload/>
  </div>
</template>

<script>
// @ is an alias to /src

import AdminFileUpload from "../components/AdminFileUpload";
export default {
  name: 'AdminFunctions',
  components: {
      AdminFileUpload
  }
}
</script>
