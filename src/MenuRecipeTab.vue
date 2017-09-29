<template>
  <div id="menu-recipe-tab">
    <v-layout>
      <v-flex md4>
        <v-text-field class="mb-0" :label="fromIng ? '素材名' : '作成アイテム'" v-model="query"></v-text-field>
      </v-flex>
      <v-flex md8>
          <p class="text-xs-left mt-4">を検索</p>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex md12>
        <v-checkbox class="mt-0" label="材料から検索" v-model="fromIng">
        </v-checkbox>
        注意: まだ動かないよ！
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex md12>
        <v-data-table no-data-text="該当アイテムがありません" :items="items"
                      :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                      rows-per-page-text="アイテム表示数">
          <template slot="items" scope="r">
            <td>
              <v-checkbox></v-checkbox>
            </td>
            <td>
              <item-button :item="r.item">
              </item-button>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import ItemButton from './ItemButton.vue'
import _ from 'lodash'
import { baseURL, getCall } from './rest'

export default {
  name: 'menu-recipe-tab',
  props: ['character'],
  data: () => ({
    query: '',
    fromIng: false,
    items: [],
  }),
  watch: {
    query: function() {
      if (this.query != '') {
        this.lazyGetItems()
      }
    }
  },
  methods: {
    lazyGetItems: _.debounce(
      function() {
        this.getItems()
      },
      500
    ),
    getItems: function() {
      getCall(baseURL+'/items?migemo=true&only-products=true&from-ingredients='+this.fromIng+'&query='+this.query, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.items = JSON.parse(xhr.response)['アイテム一覧']
        }
      })
    },
    updateRecipe: function(item) {
      this.$store.dispatch('setRecipe', item)
    }
  },
  components: {
    ItemButton
  }
}
</script>

<style scoped>
</style>
