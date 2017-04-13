<template>
  <div id="binder">
    <b-form-input v-model="query" type="text" placeholder="検索したいレシピ"></b-form-input>

    <b-table striped hover :items="recipes" :fields="fields">
      <template slot="recipe" scope="recipe">
        {{recipe.レシピ名}}
      </template>
    </b-table>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'binder',
  data: function() {
    return {
      query: '',
      recipes: [],
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
      this.getRecipes()
    }
  },
  methods: {
    getRecipes: _.debounce(
      function() {
        var url = 'https://moecoop-api.arukascloud.io/'
        var xhr = new XMLHttpRequest()
        var that = this
        xhr.onreadystatechange = function() {
          if (xhr.readyState==4 && xhr.status==200) {
            var result = JSON.parse(this.response)
            // that.recipes = result['レシピ一覧'].map(function(x) { return x['レシピ名']; });
            that.recipes = result['レシピ一覧'];
          }
        }
        xhr.respenseType = 'json'
        xhr.open('GET', url+'recipes?query='+this.query, true)
        xhr.send()
      },
      500
    )
  },
}
</script>

<style scoped>
#binder {
  padding: 10px;
}
</style>
