<template>
  <div id="item-tab">
    <v-layout>
      <v-flex md4>
        <v-text-field class="mb-0" :label="fromIng ? '素材名' : '作成アイテム'" v-model="query"></v-text-field>
      </v-flex>
      <v-flex md8>
        <div>
          <p class="text-xs-left mt-2 mb-0" v-if="loadingItems">
            を検索
            <v-progress-circular indeterminate color="primary">
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
        <v-checkbox class="mt-0" label="材料から検索" v-model="fromIng">
        </v-checkbox>
      </v-flex>
    </v-layout>

    <v-layout class="pt-1">
      <v-flex md12>
        <v-data-table no-data-text="該当アイテムがありません" :items="items"
                      :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                      rows-per-page-text="表示数"
                      hide-headers>
          <template slot="items" slot-scope="r">
            <td v-if="useCharacterInfo">
              <v-checkbox></v-checkbox>
            </td>
            <td class="text-md-center">
              <item-button both :item="r.item">
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
  name: 'item-tab',
  props: ['character'],
  data: () => ({
    query: '',
    fromIng: false,
    items: [],
    loadingItems: false,
  }),
  computed: {
    useCharacterInfo() {
      return this.$store.state.useCharacterInfo
    },
  },
  watch: {
    query: function() {
      if (this.query != '') {
        this.lazyGetItems()
      }
    },
    fromIng: function() {
      if (this.query != '') {
        this.getItems()
      }
    },
  },
  methods: {
    lazyGetItems: _.debounce(
      function() {
        this.getItems()
      },
      500
    ),
    getItems: function() {
      this.loadingItems = true
      getCall(baseURL+'/items?migemo=true&only-products=true&from-ingredients='+this.fromIng+'&query='+this.query, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.items = JSON.parse(xhr.response)['アイテム一覧']
          this.loadingItems = false
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
