<template>
  <div id="binder">
    <b-form-select v-model="selected" :options="binders" class="m-md-2">
    </b-form-select>
    から
    <b-form-input id="queryBox" v-model="query" type="text" placeholder="検索したいレシピ"></b-form-input>を検索

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
    var url = 'https://moecoop-api.arukascloud.io/'
    var xhr = new XMLHttpRequest()
    var that = this
    xhr.onreadystatechange = function() {
      if (xhr.readyState==4 && xhr.status==200) {
        var result = JSON.parse(this.response)
        that.binders = [{text: '全てのバインダー', value: '/recipes'}].concat(
          result['バインダー一覧'].map(function(b) { return { text: b.バインダー名, value: b.レシピ一覧 }; })
        )
      }
    }
    xhr.respenseType = 'json'
    xhr.open('GET', url+'binders', true)
    xhr.send()
  },
  methods: {
    getRecipes: _.debounce(
      function() {
        var url = 'https://moecoop-api.arukascloud.io'
        var xhr = new XMLHttpRequest()
        var that = this
        xhr.onreadystatechange = function() {
          if (xhr.readyState==4 && xhr.status==200) {
            var result = JSON.parse(this.response)
            that.recipes = result['レシピ一覧'];
          }
        }
        xhr.respenseType = 'json'
        xhr.open('GET', url+this.selected+'?migemo=true&query='+this.query, true)
        xhr.send()
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
