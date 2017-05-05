<template>
  <v-app id="app">
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
    <main>
      <v-content>
        <v-container fluid>
          <v-row>
            <v-col md12>
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
                  <v-row>
                    <v-col md2 xs6>
                      <v-select label="キャラクター" v-model="selected" :items="characters" item-value="text" item-text="text">
                      </v-select>
                    </v-col>
                    <v-col md1>
                      <v-dialog v-model="dlg">
                        <v-btn class="ml-0 black--text" floating small slot="activator">
                          <v-icon>edit</v-icon>
                        </v-btn>
                        <v-card>
                          <v-card-row>
                            <v-card-title>
                              キャラクター管理
                            </v-card-title>
                          </v-card-row>
                          キャラクター一覧
                          <v-card-row>
                            <v-list dense>
                              <v-list-item v-bind:key="item.text" v-for="(item, idx) in characters">
                                <v-list-tile avatar>
                                  <v-list-tile-content>
                                    <v-list-tile-title v-text="item.text" />
                                  </v-list-tile-content>
                                  <v-list-tile-action>
                                    <v-btn icon ripple small default>
                                      <v-icon class="black--text">edit</v-icon>
                                    </v-btn>
                                  </v-list-tile-action>
                                  <v-list-tile-action>
                                    <v-btn icon ripple small default @click.native="deleteCharacter(item.text)" v-if="characters.length > 1">
                                      <v-icon class="black--text">delete</v-icon>
                                    </v-btn>
                                    <v-btn icon ripple small default disabled v-else>
                                      <v-icon class="black--text">delete</v-icon>
                                    </v-btn>
                                  </v-list-tile-action>
                                </v-list-tile>
                                <v-divider v-if="idx + 1 < characters.length"></v-divider>
                              </v-list-item>
                            </v-list>
                          </v-card-row>
                          <v-card-row actions>
                            <v-btn class="green--text darken-1" flat="flat" @click.native="dlg = false">閉じる</v-btn>
                          </v-card-row>
                        </v-card>
                      </v-dialog>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col xs12>
                      <binder></binder>
                    </v-col>
                  </v-row>
                </v-tab-content>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row>
            <v-col md12>
              <p class="text-md-center">
                <v-chip class="primary white--text hidden-xs-only">広告</v-chip>
                <v-chip class="secondary white--text hidden-sm-and-up">広告</v-chip>
                {{adMessage}}
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </main>
  </v-app>
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
      dlg: false,
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
  methods: {
    deleteCharacter: function(char) {
      const s = this.selected
      this.characters = this.characters.filter((e) => e.text != char)
      if (s.text == char) {
        this.selected = this.characters[0]
      }
    },
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
