<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="headerWelcome">
    <div class="headerDivWelcome1">Welcome to CoMMS
      <div class="headerDivWelcome2">The Construction Material Management System</div>
    </div>
  </header>
  <div class="bodyDivWelcome1">
    <div class="bodyDivWelcome2">The Construction Material Management System, or CoMMS, is a system through which employees of construction
      companies, or companies in fields that require similar material tracking, can keep track of materials throughout a job site. This system
      is designed to be used through this website for easy accessibility.
    </div>
    <RouterLink to="/home">
      <button class="buttomWelcome">Go To Home</button>
    </RouterLink>
  </div>
</template>

<style scoped>

.headerWelcome {
  position: absolute;
  left: 30%;
  top: 2%;
}

.headerDivWelcome1 {
  position: relative;
  font-size: 4em;
}

.headerDivWelcome2 {
  position: relative;
  left: -7%;
  font-size: 0.5em;
}

.bodyDivWelcome1 {
  position: absolute;
  top: 30%;
  left: 25%;
  font-size: 1.5em;
  width: 50%;
}

.bodyDivWelcome2 .wrapper {
  position: relative;
  width: 100%;
  word-wrap: break-word;
}

.buttomWelcome {
  position: relative;
  top: 50%;
  left: 35%;
  width: 20%;
}

</style>