<script setup>
import NavBar from './NavBar.vue'
</script>

<template>
  <header class="headerJobs">
    <div class="headerDivJobs">Current Jobs</div>
  </header>
  <body class="bodyJobs">

  </body>
  <NavBar />
</template>

<style scoped>

.headerJobs {
  position: absolute;
  left: 40%;
  top: 2%;
}

.headerDivJobs {
  position: relative;
  font-size: 4em;
}

</style>