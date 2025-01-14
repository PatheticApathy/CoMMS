<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div ref="el">
      <div class="full">

        <div class="leftNavBarDiv1">
          <nav class="leftNavBarNav" aria-label="Primary" role="Navigation">
            <RouterLink to="/home">
              <div class="leftNavBarDiv2">
                <div class="leftNavBarDiv3">
                </div>
                <div class="leftNavBarDiv4">
                </div>Home
              </div>
            </RouterLink>
          </nav>
          <nav class="leftNavBarNav" aria-label="Primary" role="Navigation">
            <RouterLink to="/jobs">
              <div class="leftNavBarDiv2">
                <div class="leftNavBarDiv3">
                </div>
                <div class="leftNavBarDiv4">
                </div>Jobs
              </div>
            </RouterLink>
          </nav>
        </div>

      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  overflow: hidden;
}

.full {
  height: 100%;
  width: 15%;
  border-right: 1px solid var(--color-border);
  position: fixed;
  left: 0%;
  top: 0%;
}

nav a {
  display: inline-block;
  padding-left: 5.614035087719298245614035087719%;
  width: 100%;
}


.leftNavBarNav {
  width: 90%
}

.leftNavBarNav:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
}


.leftNavBarDiv1 {
  height: 80%;
  width: 80%;
  position: relative;
  left: 20%;
  top: 3%;
}

.leftNavBarDiv2 {
  height: 5%;
  width: 90%;
  font-family: 'Verdana', 'sans-serif';
  font-weight: 900;
}

.leftNavBarDiv3 {
  height: 26.25px;
}

.leftNavBarDiv4 {
  height: 5%;
  width: 100%;
}

.leftNavBarSpan {
  height: 100%;
  width: 100%;
}
</style>
