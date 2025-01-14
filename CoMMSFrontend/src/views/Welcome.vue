<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="headerDivWelcome1">Welcome to CoMMS
    <div class="headerDivWelcome2">The Construction Material Management System</div>
  </div>
  <div class="bodyDivWelcome1">
    <div class="bodyDivWelcome2">The Construction Material Management System, or CoMMS, is a system through which employees of construction
      companies, or companies in fields that require similar material tracking, can keep track of materials throughout a job site. This system
      is designed to be used through this website for easy accessibility.
    </div>
  </div>
  <div class="WelcomeButtonDiv">
      <RouterLink to="/home" class="routerHomeFromWelcome">
        <button class="buttomWelcome">Go To Home</button>
      </RouterLink>
    </div>
</template>

<style scoped>

.headerDivWelcome1 {
  position: absolute;
  top: 2%;
  font-size: 4em;
  width: 100%;
  margin-inline: auto;
  text-align: center;
  height: 100%;
}

.headerDivWelcome2 {
  position: relative;
  font-size: 0.5em;
}

.bodyDivWelcome1 {
  position: absolute;
  top: 25%;
  font-size: 1.5em;
  width: 100%;
}

.bodyDivWelcome2 {
  position: relative;
  width: 50%;
  word-wrap: break-word;
  margin-inline: auto;
}

.WelcomeButtonDiv {
  position: relative;
  top: 20%;
  width: 200%;
  margin-inline: auto;
  display: flex;
  align-items: center;
}

.routerHomeFromWelcome {
  position: relative;
  top: 20%;
  width: 100%;
  height: 200%;
  display: flex;
}

.buttomWelcome {
  position: relative;
  width: 10%;
  height: 100%;
  margin-inline: auto;
}

</style>