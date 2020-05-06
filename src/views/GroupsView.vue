<template>
  <div class="all-groups">
    <h2>Здесь будут все группы</h2>
    <AllGroups/>
  </div>
</template>

<script>
// @ is an alias to /src
import AllGroups from "../components/AllGroups";

export default {
  name: 'GroupView',
  components: {
    AllGroups,
  }
}
</script>
