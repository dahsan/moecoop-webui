<template>
  <div id="binder">
    <b-form-select v-model="selected" :options="binders" class="m-md-2">
    </b-form-select>
    から
    <b-form-input id="queryBox" v-model="query" type="text" placeholder="レシピ名"></b-form-input>
    を検索

    <b-table striped hover :items="recipes" :fields="fields" @row-clicked="showDetail">
      <template slot="recipe" scope="recipe">
        {{recipe.レシピ名}}
      </template>
    </b-table>

    <b-card header="レシピ情報" v-model="msg">
      {{msg}}
    </b-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { baseURL, restCall } from './rest'

export default {
  name: 'binder',
  data: function() {
    return {
      msg: '',
      query: '',
      selected: '',
      binders: [],
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
  mounted: function() {
    var that = this;
    restCall('GET', baseURL+'/binders', function(xhr) {
      console.log("てすてす")
      if (xhr.readyState==4 && xhr.status==200) {
        var result = JSON.parse(xhr.response)
        that.binders = [{text: '全てのバインダー', value: '/recipes'}].concat(
          result['バインダー一覧'].map(function(b) { return { text: b.バインダー名, value: b.レシピ一覧 }; })
        )
        console.log("バインダー: "+that.binders)
      }
    })
  },
  methods: {
    getRecipes: _.debounce(
      function() {
        var that = this;
        restCall('GET', baseURL+this.selected+'?migemo=true&query='+this.query, function(xhr) {
          if (xhr.readyState==4 && xhr.status==200) {
            var result = JSON.parse(xhr.response)
            that.recipes = result['レシピ一覧'];
          }
        })
      },
      500
    ),
    showDetail: function(item, index) {
      this.msg = this.recipes[index].レシピ名
    },
  },
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
