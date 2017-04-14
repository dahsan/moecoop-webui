<template>
<div id="app">
  <b-navbar toggleable type="inverse" variant="success">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>
    <b-link class="navbar-brand" to="#">
      <img src="./assets/moecoop.svg" height=40>
      <span>生協の知恵袋 ウェブ版</span>
    </b-link>

    <b-collapse is-nav id="nav_collapse">

      <b-nav is-nav-bar>
        <b-nav-item>
          <b-link class="navbar-brand" to="http://docs.fukuro.coop.moe/">
            ドキュメント
          </b-link>
        </b-nav-item>
        <b-nav-item>
          <b-link class="navbar-brand" to="https://twitter.com/coop_moe">
            Twitter
          </b-link>
        </b-nav-item>
      </b-nav>

      <b-nav is-nav-bar class="ml-auto">
        <b-nav-item>
          <b-link class="navbar-brand" to="https://github.com/coop-mojo/moecoop-webui">
            Github
          </b-link>
        </b-nav-item>

      </b-nav>
    </b-collapse>
  </b-navbar>

  <b-dropdown id="char-box" text="キャラクター" size="sm" class="m-md-2">
    <b-dropdown-item v-for="c in characters" :key="c">
      {{c}}
    </b-dropdown-item>
  </b-dropdown>

  <!-- もう少しスペース -->
  <!-- もう少し右 -->
  <b-tabs small ref="tabs" v-model="tabIndex">
    <b-tab title="バインダー">
      <binder></binder>
    </b-tab>
    <b-tab title="スキル" disabled>
    </b-tab>
    <b-tab title="レシピ材料" disabled>
    </b-tab>
  </b-tabs>
</div>
</template>

<script>
import Binder from './Binder.vue'

export default {
  name: 'app',
  data() {
    return {
      characters: ['しらたま', 'かきあげ'],
    }
  },
  components: {
    Binder
  }
}

</script>

<style scoped>
#app {
  padding: 20px;
  height: 300px;
}

#char-box {
  padding: 2px;
}
</style>
