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
                  <svg class="leftNavBarSvg" view-box="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="placeholder"></path>
                    </g>
                  </svg>
                </div>
                <div class="leftNavBarDiv4">
                  <span class="leftNavBarSpan" style="text-overflow:unset;">Home
                  </span>
                </div>
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
  width: 25.78125%;
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


.logo {
  position: relative;
  left: 24.242424242424242424242424242424%;
  top: 1.067235859124866595517609391676%;
  font-size: 3rem;
  text-align: left;
  font-family: 'Verdana', 'sans-serif';
  font-weight: 900;
}

.leftNavBarNav {
  height: 73.739327641408751334044823906083%;
  width: 95%
}

.leftNavBarDiv1 {
  height: 73.739327641408751334044823906083%;
  width: 75.757575757575757575757575757576%;
  position: relative;
  left: 32.323232323232323232323232323232%;
  top: 0%;
}

.leftNavBarDiv2 {
  height: 5%;
  width: 90%;
  font-family: 'Verdana', 'sans-serif';
  font-weight: 900;
}


.leftNavBarDiv3 {
  height: 26.25px;
  width: 26.25px;
}

.leftNavBarSvg {
  height: 26.25px;
  width: 26.25px;
}

.leftNavBarDiv4 {
  height: 5%;
  width: 100%;
}

.leftNavBarSpan {
  height: 100%;
  width: 100%;
}

g {
  height: 23px;
  width: 21.8833px;
}

path {
  height: 23px;
  width: 21.8833px;
}

@media (min-width: 1024px) {

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
