<template>
  <v-app id="app">
    <v-toolbar>
      <img :src="logo" width="27"></img>
      <v-toolbar-title>生協の知恵袋</v-toolbar-title>
      <v-spacer></v-spacer>
      <a href="http://docs.fukuro.coop.moe/" class="mr-1">
        <v-icon class="white--text">help</v-icon>
      </a>
      <a href="https://twitter.com/coop_moe" class="mr-1">
        <img :src="twitter" width="30" height="30"></img>
      </a>
      <a href="https://github.com/coop-mojo/moecoop-webui">
        <img :src="github" width="22" height="22"></img>
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
                <v-tab-item ripple slot="activators" href="#menu-recipe-tab">
                  レシピ材料
                </v-tab-item>
                <v-tab-content slot="content" id="binder-tab">
                  <v-row>
                    <v-col xs12 sm6 md7 lg8>
                      <v-row v-if="characters.length > 1">
                        <v-col xs5 md5>
                          <v-select class="mb-0" label="キャラクター" v-model="sCharacter" :items="Object.values(characters)" item-text="name">
                          </v-select>
                        </v-col>
                        <v-col md1>
                          <v-btn class="ml-0 black--text" floating small>
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <recipe-tab title="バインダー" :categories="binders" :character="sCharacter">
                      </recipe-tab>
                    </v-col>

                    <v-col sm6 md5 lg4 class="hidden-xs-only">
                      <recipe-card v-show="$store.state.recipe.レシピ名 != ''">
                      </recipe-card>
                      <item-card v-show="$store.state.item.アイテム名 != ''">
                      </item-card>
                    </v-col>
                  </v-row>
                </v-tab-content>

                <v-tab-content slot="content" id="menu-recipe-tab">
                  <v-row>
                    <v-col xs12 md8>
                      <v-row v-if="characters.length > 1">
                        <v-col xs5 md5>
                          <v-select class="mb-0" label="キャラクター" v-model="sCharacter" :items="Object.values(characters)" item-text="name">
                          </v-select>
                        </v-col>
                        <v-col md1>
                          <v-btn class="ml-0 black--text" floating small>
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <menu-recipe-tab :character="sCharacter">
                      </menu-recipe-tab>
                    </v-col>

                    <v-col md4 class="hidden-xs-only">
                      <recipe-card v-show="$store.state.recipe.レシピ名 != ''">
                      </recipe-card>
                      <!-- <v-dialog v-model="rdlg" fullscreen :overlay=false persistent class="hidden-sm-and-up"> -->
                      <!--   <v-btn light flat slot="activator"></v-btn> -->
                      <!--   <recipe-card :recipeDlg.sync="rdlg"> -->
                      <!--   </recipe-card> -->
                      <!-- </v-dialog> -->

                      <item-card v-show="$store.state.item.アイテム名 != ''">
                      </item-card>
                      <!-- <v-dialog v-model="idlg" fullscreen :overlay=false persistent class="hidden-sm-and-up"> -->
                      <!--   <v-btn light flat slot="activator"></v-btn> -->
                      <!--   <item-card :itemDlg.sync="idlg"> -->
                      <!--   </item-card> -->
                      <!-- </v-dialog> -->
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
import RecipeTab from './RecipeTab.vue'
import MenuRecipeTab from './MenuRecipeTab.vue'
import RecipeCard from './RecipeCard.vue'
import ItemCard from './ItemCard.vue'
import logo from './assets/moecoop.svg'
import twitter from './assets/Twitter_Social_Icon_White.svg'
import github from './assets/GitHub-Mark-Light-64px.png'
import { baseURL, restCall } from './rest'

export default {
  name: 'app',
  data() {
    return {
      binders: [],
      skills: [],
      sCharacter: { name: '' },
      logo: logo,
      twitter: twitter,
      github: github,
      adMessage: "ダイアロス生活協同組合は P 鯖と E 鯖で活動中！晩御飯からピッキングの相談までお気軽にどうぞ！",
      // rdlg: false,
      // idlg: false,
    }
  },
  computed: {
    characters() {
      return this.$store.state.characters
    },
    // recipe() {
    //   return this.$store.state.recipe
    // },
    // item() {
    //   return this.$store.state.item
    // }
  },
  // watch: {
  //   recipe: function() {
  //     this.rdlg = true
  //   },
  //   item: function() {
  //     this.idlg = true
  //   }
  // },
  mounted: function() {
    this.sCharacter = this.characters[0]
    restCall('GET', baseURL+"/information", (xhr) => {
      if (xhr.readyState==4 && xhr.status==200) {
        const msg = JSON.parse(xhr.response)["message"]
        if (msg.length > 0) {
          this.adMessage = msg
        }
      }
    })
    restCall('GET', baseURL+'/binders', (xhr) => {
      if (xhr.readyState==4 && xhr.status==200) {
        const result = JSON.parse(xhr.response)
        this.binders = [{text: '全てのバインダー', value: '/recipes'}].concat(
          result['バインダー一覧'].map(b => ({ text: b.バインダー名, value: b.レシピ一覧 }))
        )
      }
    })
  },
  methods: {
    deleteCharacter: function(char) {
      const s = this.sCharacter
      this.$store.commit('deleteCharacter', char)
      if (s.text == char) {
        this.sCharacter = this.characters[0]
      }
    },
  },
  components: {
    RecipeTab,
    MenuRecipeTab,
    RecipeCard,
    ItemCard
  }
}

</script>

<style scoped>
  .fa {
    color: white;
  }
</style>
