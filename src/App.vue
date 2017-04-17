<template>
<div id="app" class="app-base">
  <b-navbar toggleable type="inverse" variant="success">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>
    <b-link class="navbar-brand" to="#">
      <img :src="logo" height=27>
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

  <div class="m-md-2">
    キャラクター:
    <b-form-select v-model="selected" :options="characters">
    </b-form-select>
  </div>

  <b-tabs small id="tabs" ref="tabs">
    <b-tab title="バインダー">
      <binder class="justify-content-center"></binder>
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
import logo from './assets/moecoop.svg'

export default {
  name: 'app',
  data() {
    return {
      characters: ['しらたま', 'かきあげ', 'もじょうにー'],
      selected: '',
      logo: logo,
    }
  },
  mounted: function() {
    this.selected = this.characters[0]
  },
  components: {
    Binder
  }
}

</script>

<style scoped>
.binder-base {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction:         row;
}

#tabs {
  padding: 2px;
}
</style>
