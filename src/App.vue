<template>
  <v-app id="app" fixed-footer fill-height>
    <main>
      <v-tabs dark v-model="active">
        <v-tabs-bar>
          <v-tabs-slider class="yellow">
          </v-tabs-slider>
          <v-tabs-item href="#menu-recipe-tab">
            レシピ材料
          </v-tabs-item>
          <v-tabs-item href="#binder-tab">
            バインダー
          </v-tabs-item>
        </v-tabs-bar>
        <v-container fluid>
          <v-layout>
            <v-flex md8>
              <v-layout row wrap v-if="false">
                <v-flex d-flex md3>
                  <v-select label="キャラクター" v-model="sCharacter" :items="Object.values(characters)" item-text="name">
                  </v-select>
                </v-flex>
                <v-flex md3>
                  <v-btn fab small>
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>

              <v-tabs-items>
                <v-tabs-content id="menu-recipe-tab">
                  <menu-recipe-tab :character="sCharacter">
                  </menu-recipe-tab>
                </v-tabs-content>
                <v-tabs-content id="binder-tab">
                  <recipe-tab title="バインダー" :categories="binders" :character="sCharacter">
                  </recipe-tab>
                </v-tabs-content>
              </v-tabs-items>
            </v-flex>
            <v-flex sm6 md5 lg4 class="hidden-xs-only">
              <router-view name="item"></router-view>
              <router-view name="recipe"></router-view>
            </v-flex>
          </v-layout>
        </v-container>
      </v-tabs>
    </main>
    <v-footer>
      <img :src="logo" width="16"></img>
      生協の知恵袋
      <v-spacer></v-spacer>
      <a href="http://docs.fukuro.coop.moe/" class="mr-1">
        <v-icon>fa-question-circle</v-icon>
      </a>
      <a href="https://twitter.com/coop_moe" class="mr-1">
        <v-icon>fa-twitter</v-icon>
      </a>
      <a href="https://github.com/coop-mojo/moecoop-webui">
        <v-icon>fa-github</v-icon>
      </a>
    </v-footer>
  </v-app>
</template>

<script>
import RecipeTab from './RecipeTab.vue'
import MenuRecipeTab from './MenuRecipeTab.vue'
import logo from './assets/moecoop.svg'
import twitter from './assets/Twitter_Social_Icon_White.svg'
import github from './assets/GitHub-Mark-Light-64px.png'
import { baseURL, getCall } from './rest'

export default {
  name: 'app',
  data() {
    return {
      active: null,
      binders: [],
      skills: [],
      sCharacter: { name: '' },
      logo: logo,
      twitter: twitter,
      github: github,
      adMessage: "ダイアロス生活協同組合は P 鯖と E 鯖で活動中！晩御飯からピッキングの相談までお気軽にどうぞ！",
    }
  },
  computed: {
    characters() {
      return this.$store.state.characters
    },
  },
  mounted: function() {
    this.sCharacter = this.characters[0]
    getCall(baseURL+"/information", (xhr) => {
      if (xhr.readyState==4 && xhr.status==200) {
        const msg = JSON.parse(xhr.response)["message"]
        if (msg.length > 0) {
          this.adMessage = msg
        }
      }
    })
    getCall(baseURL+'/binders', (xhr) => {
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
  }
}

</script>

<style>

  /* Note: scoped に入れるとうまくいかない */
  div.input-group__details {
    min-height: 0px;
  }

</style>
