<template>
<div id="app">
  <b-navbar toggleable type="inverse" variant="success">

    <b-nav-toggle target="nav_collapse" />
    <b-link class="navbar-brand" to="#">
      <img :src="logo" height=27>
      <span>生協の知恵袋</span>
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
    <b-form-select v-model="selected" :options="characters" />
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

  <div id="ad" v-model="adMessage" class="justify-content-center row">
    <b-badge variant="primary">広告</b-badge> {{adMessage}}
  </div>
</div>
</template>

<script>
import Binder from './Binder.vue'
import logo from './assets/moecoop.svg'
import { baseURL, restCall } from './rest'

export default {
  name: 'app',
  data() {
    return {
      characters: ['しらたま', 'かきあげ', 'もじょうにー'],
      selected: '',
      logo: logo,
      adMessage: "ダイアロス生活協同組合は P 鯖と E 鯖で活動中！晩御飯からピッキングの相談までお気軽にどうぞ！",
    }
  },
  mounted: function() {
    this.selected = this.characters[0]
    restCall('GET', baseURL+"/information", (xhr) => {
      if (xhr.readyState==4 && xhr.status==200) {
        const msg = JSON.parse(xhr.response)["message"]
        if (msg.length > 0) {
          this.adMessage = msg
        }
      }
    })
  },
  components: {
    Binder
  }
}

</script>

<style scoped>
  #app {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction:         column;
  }

  #tabs {
    padding: 2px;
  }
</style>
