<template>
  <div id="app">
    <v-toolbar>
      <img :src="logo" width="27"></img>
      <v-toolbar-title>生協の知恵袋</v-toolbar-title>
      <v-spacer></v-spacer>
      <a href="http://docs.fukuro.coop.moe/" class="mr-3 mt-1">
        <v-icon class="white--text">help</v-icon>
      </a>
      <a href="https://twitter.com/coop_moe" class="mr-3">
        <i class="fa fa-twitter" aria-hidden="true"></i>
      </a>
      <a href="https://github.com/coop-mojo/moecoop-webui">
        <i class="fa fa-github" aria-hidden="true"></i>
      </a>
    </v-toolbar>
    <v-tabs centered>
      <v-tab-item ripple slot="activators" href="#binder-tab">
        バインダー
      </v-tab-item>
      <v-tab-item ripple slot="activators" href="#skill-tab" disabled>
        スキル
      </v-tab-item>
      <v-tab-item ripple slot="activators" href="#recipe-menu-tab" disabled>
        レシピ材料
      </v-tab-item>

      <v-tab-content slot="content" id="binder-tab">
        <v-container fluid>
          <v-row>
            <v-col md2 xs6>
              <v-select label="キャラクター" v-model="selected" :items="characters" item-value="text"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs12>
              <v-card>
                <binder></binder>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-content>
    </v-tabs>
    <v-chip class="primary white--text">広告</v-chip>{{adMessage}}
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
      characters: [
        { text: 'しらたま' },
        { text: 'かきあげ' },
        { text: 'もじょうにー' }
      ],
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
  .fa {
    color: white;
  }
</style>
