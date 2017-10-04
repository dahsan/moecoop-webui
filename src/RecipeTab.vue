<template>
  <div id="recipe-tab">
    <v-layout>
      <v-flex md4>
        <v-select :label="title" v-model="sCategory" :items="categories" item-value="バインダー名">
        </v-select>
      </v-flex>
      <v-flex md8>
        <p class="text-xs-left mt-4">から</p>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex md5>
        <v-text-field class="mt-0 mb-0" label="レシピ名" v-model="query"></v-text-field>
      </v-flex>
      <v-flex md7>
        <div>
          <p class="text-xs-left mt-2 mb-0" v-if="loadingRecipes">
            を検索
            <v-progress-circular indeterminate class="primary--text">
            </v-progress-circular>
          </p>
          <p class="text-xs-left mt-4 mb-0" v-else>
            を検索
          </p>
        </div>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex md12>
        <v-data-table select-all no-data-text="該当レシピがありません" :items="recipes"
                      :headers="[{ text: 'レシピ名', value: 'レシピ名'}]"
                      rows-per-page-text="レシピ表示数">
          <template slot="items" scope="r">
            <td>
              <v-checkbox></v-checkbox>
            </td>
            <td>
              <recipe-button :recipe="r.item">
              </recipe-button>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import RecipeButton from './RecipeButton.vue'
import _ from 'lodash'
import { baseURL, getCall } from './rest'

export default {
  name: 'recipe-tab',
  props: ['title', 'categories', 'character'],
  data: () => ({
    query: '',
    sCategory: '',
    recipes: [],
    loadingRecipes: false,
  }),
  watch: {
    categories: function() {
      this.sCategory = this.categories[0]
    },
    query: function() {
      if (this.sCategory.text != '全てのバインダー' || this.query != '') {
        this.lazyGetRecipes()
      }
    },
    sCategory: function() {
      if (this.sCategory.text != '全てのバインダー' || this.query != '') {
        this.getRecipes()
      }
    }
  },
  methods: {
    lazyGetRecipes: _.debounce(
      function() {
        this.getRecipes()
      },
      500
    ),
    getRecipes: function() {
      this.loadingRecipes = true
      const qstr = (this.query == '') ? '' : '&query='+this.query
      getCall(baseURL+this.sCategory.value+'?migemo=true&fields=生成物'+qstr, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.recipes = JSON.parse(xhr.response)['レシピ一覧']
        }
        this.loadingRecipes = false
      })
    },
    updateRecipe: function(item) {
      this.$store.dispatch('setRecipe', item)
    }
  },
  components: {
    RecipeButton
  }
}
</script>

<style scoped>
</style>
