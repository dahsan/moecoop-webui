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
                    <v-col xs12 md6>
                      <v-row>
                        <v-col xs6 md5>
                          <v-select label="キャラクター" v-model="sCharacter" :items="characters" item-value="text" item-text="text">
                          </v-select>
                        </v-col>
                        <v-col md1>
                          <v-btn class="ml-0 black--text" floating small>
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <recipe-tab title="バインダー" :categories="binders" :character="sCharacter" :recipe.sync="recipe">
                      </recipe-tab>
                    </v-col>

                    <v-col md6 class="hidden-xs-only">
                      <info-card :recipe="recipe" v-show="'レシピ名' in recipe">
                      </info-card>
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
import InfoCard from './InfoCard.vue'
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
      binders: [],
      skills: [],
      recipe: {},
      sCharacter: { text: '' },
      logo: logo,
      adMessage: "ダイアロス生活協同組合は P 鯖と E 鯖で活動中！晩御飯からピッキングの相談までお気軽にどうぞ！",
    }
  },
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
      this.characters = this.characters.filter((e) => e.text != char)
      if (s.text == char) {
        this.sCharacter = this.characters[0]
      }
    },
  },
  components: {
    RecipeTab,
    InfoCard
  }
}

</script>

<style scoped>
  .fa {
    color: white;
  }
</style>
