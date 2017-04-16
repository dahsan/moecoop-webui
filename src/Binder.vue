<template>
  <div id="binder">
    <b-form-select v-model="selected" :options="binders" class="m-md-2">
    </b-form-select>
    から
    <b-form-input id="queryBox" v-model="query" type="text" placeholder="レシピ名"></b-form-input>
    を検索

    <b-table striped hover :items="recipes" :fields="fields" @row-clicked="showDetail">
      <template slot="r" scope="r">
        {{r.レシピ名}}
      </template>
    </b-table>

    <recipe-card :recipe="recipe">
    </recipe-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { baseURL, restCall } from './rest'
import RecipeCard from './RecipeCard.vue'

export default {
  name: 'binder',
  data: function() {
    return {
      query: '',
      selected: '',
      binders: [],
      recipes: [],
      recipe: {},
      fields: {
        レシピ名: {
          label: 'レシピ名',
          sortable: true,
        }
      }
    }
  },
  watch: {
    query: function() {
      this.lazyGetRecipes()
    },
    selected: function() {
      this.getRecipes()
    }
  },
  mounted: function() {
    var that = this;
    restCall('GET', baseURL+'/binders', function(xhr) {
      if (xhr.readyState==4 && xhr.status==200) {
        var result = JSON.parse(xhr.response)
        that.binders = [{text: '全てのバインダー', value: '/recipes'}].concat(
          result['バインダー一覧'].map(function(b) { return { text: b.バインダー名, value: b.レシピ一覧 }; })
        )
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
      var that = this
      restCall('GET', baseURL+this.selected+'?migemo=true&query='+this.query, function(xhr) {
        if (xhr.readyState==4 && xhr.status==200) {
          var result = JSON.parse(xhr.response)
          that.recipes = result['レシピ一覧'];
        }
      })
    },
    showDetail: function(item, index) {
      this.recipe = this.recipes[index]
    },
  },
  components: {
    RecipeCard
  }
}
</script>

<style scoped>
#binder {
  padding: 10px;
}

#queryBox {
  width: 200px;
}

</style>
