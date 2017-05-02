<template>
  <div id="binder">
    <div class="recipe-list">
      <v-select label="バインダー" v-model="selected" :items="binders">
      </v-select>から
      <v-text-field label="レシピ名" v-model="query" type="text"></v-text-field> を検索

      <v-data-table select-all no-data-text="ここにレシピが表示されます" v-model="recipes"
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
    </div>

    <!-- <info-card :recipe="recipe" class="info-detail" v-show="'レシピ名' in recipe"> -->
    <!-- </info-card> -->
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
    //headers: [
    //  'レシピ名',
    //],
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
        this.selected = this.binders[0].value
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
      restCall('GET', baseURL+this.selected+'?migemo=true&fields=生成物&query='+this.query, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.recipes = JSON.parse(xhr.response)['レシピ一覧'];
          console.log("レシピ: "+JSON.stringify(this.recipes))
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
