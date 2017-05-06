<template>
  <div id="recipe-tab">
    <v-container fluid>
      <v-row>
        <v-col md6>
          <v-select class="mt-0 mb-0" :label="title" v-model="sCategory" :items="categories">
          </v-select>
        </v-col>
        <v-col md6>
          <p class="text-xs-left">から</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col md6>
          <v-text-field class="mt-0 mb-0" label="レシピ名" v-model="query" type="text"></v-text-field>
        </v-col>
        <v-col md6>
          <p class="text-xs-left">を検索</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12>
          <v-data-table select-all no-data-text="該当レシピがありません" v-model="recipes"
                        :headers="[{ text: 'レシピ名', value: 'レシピ名'}]"
                        rows-per-page-text="レシピ表示数">
            <template slot="items" scope="r">
              <td>
                <v-checkbox></v-checkbox>
              </td>
              <td>
                <v-btn light flat class="hidden-xs-only" @click.native="updateRecipe(r.item)">{{r.item.レシピ名}}</v-btn>
                <v-dialog v-model="dlg" fullscreen :overlay=false persistent class="hidden-sm-and-up">
                  <v-btn light flat slot="activator" @click.native="updateRecipe(r.item)">{{r.item.レシピ名}}</v-btn>
                  <info-card :recipe="recipe" :dlg.sync="dlg">
                  </info-card>
                </v-dialog>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import InfoCard from './InfoCard.vue'
import _ from 'lodash'
import { baseURL, restCall } from './rest'

export default {
  name: 'recipe-tab',
  props: ['title', 'categories', 'character', 'recipe'],
  data: () => ({
    query: '',
    sCategory: '',
    recipes: [],
    dlg: false,
  }),
  watch: {
    categories: function() {
      this.sCategory = this.categories[0]
    },
    query: function() {
      this.lazyGetRecipes()
    },
    sCategory: function() {
      this.getRecipes()
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
      restCall('GET', baseURL+this.sCategory.value+'?migemo=true&fields=生成物&query='+this.query, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.recipes = JSON.parse(xhr.response)['レシピ一覧']
        }
      })
    },
    updateRecipe: function(item) {
      this.$emit('update:recipe', item)
    }
  },
  components: {
    InfoCard
  }
}
</script>

<style scoped>
</style>
