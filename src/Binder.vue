<template>
  <div id="binder" class="binder-base">
    <div class="recipe-list">
      <b-form-select v-model="selected" :options="binders">
      </b-form-select>
      から
      <b-form-input id="queryBox" v-model="query" type="text" placeholder="レシピ名"></b-form-input>
      を検索

      <b-table striped hover :items="recipes" :fields="fields" :current-page="currentPage" :per-page="perPage"
               @row-clicked="showDetail">
        <template slot="r" scope="r">
          {{r.レシピ名}}
        </template>
      </b-table>
      <div class="justify-content-center">
        <b-pagination size="md" :total-rows="this.recipes.length" :per-page="perPage" v-model="currentPage" />
      </div>
    </div>
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
      currentPage: 1,
      perPage: 10,
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
        that.selected = that.binders[0].value
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
      this.recipe = item
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

.binder-base {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction:         row;
}

.recipe-list {
  -webkit-flex-direction: column;
  flex-direction:         column;
}

#queryBox {
  width: 200px;
}

</style>
