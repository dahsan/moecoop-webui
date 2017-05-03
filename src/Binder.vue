<template>
  <div id="binder">
    <v-container fluid>
      <v-row>
        <v-col md2 xs6>
          <v-select class="mt-0 mb-0" label="バインダー" v-model="selected" :items="binders" >
          </v-select>
        </v-col>
        <v-col md1 xs1>
          <p class="text-xs-left">から</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col md3 xs9>
          <v-text-field class="mt-0 mb-0" label="レシピ名" v-model="query" type="text"></v-text-field>
        </v-col>
        <v-col md1 xs1>
          <p class="text-xs-left">を検索</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col md12>
          <v-data-table select-all no-data-text="該当レシピがありません" v-model="recipes"
                        :headers="[{ text: 'レシピ名', value: 'レシピ名'}]">
            <template slot="items" scope="r">
              <td>
                <v-checkbox></v-checkbox>
              </td>
              <td>
                {{r.item.レシピ名}}
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

    <!-- <info-card :recipe="recipe" class="info-detail" v-show="'レシピ名' in recipe"> -->
    <!-- </info-card> -->
    </v-container>
  </div>
</template>

<script>
import _ from 'lodash'
import { baseURL, restCall } from './rest'
// import InfoCard from './InfoCard.vue'

export default {
  name: 'binder',
  data: () => ({
    query: '',
    selected: '',
    binders: [],
    recipes: [],
    //recipe: {},
  }),
  watch: {
    query: function() {
      this.lazyGetRecipes()
    },
    selected: function() {
      this.getRecipes()
    }
  },
  mounted: function() {
    restCall('GET', baseURL+'/binders', (xhr) => {
      if (xhr.readyState==4 && xhr.status==200) {
        const result = JSON.parse(xhr.response)
        this.binders = [{text: '全てのバインダー', value: '/recipes'}].concat(
          result['バインダー一覧'].map(b => ({ text: b.バインダー名, value: b.レシピ一覧 }))
        )
        this.selected = this.binders[0]
      }
    })
  },
  methods: {
    lazyGetRecipes: _.debounce(
      function() {
        this.getRecipes()
      },
      500
    ),
    getRecipes: function() {
      restCall('GET', baseURL+this.selected.value+'?migemo=true&fields=生成物&query='+this.query, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.recipes = JSON.parse(xhr.response)['レシピ一覧']
        }
      })
    },
    // showDetail: function(item, index) {
    //  this.recipe = item
    // },
  },
  // components: {
  //   InfoCard
  // }
}
</script>

<style scoped>
</style>
