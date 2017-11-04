<template>
<div id="recipe-result-step">
  <v-layout class="mt-4">
    <v-flex md12>
      <h6>作成候補</h6>
      <v-data-table no-data-text="作成候補はありません" :items="targets_"
                    :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <th class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
          </th>
          <td>
            {{r.item.個数}}個
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout class="mt-5">
    <v-flex md12>
      <h6>必要レシピ</h6>
      <v-data-table no-data-text="必要なレシピはありません" :items="recipes"
                    :headers="[{ text: 'レシピ', value: 'レシピ名'}]"
                    rows-per-page-text="レシピ表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td class="text-md-center">
            <recipe-button both :recipe="r.item">
            </recipe-button>
          </td>
          <td>
            {{r.item.コンバイン数}}回
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout class="mt-5">
    <v-flex md12>
      <h6>必要アイテム</h6>
      <v-data-table no-data-text="必要なアイテムはありません" :items="items"
                    :headers="[{ text: 'アイテム', value: 'アイテム名'}]"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
          </td>
          <td>
            {{r.item.個数}}個
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout class="mt-5">
    <v-flex md12>
      <h6>余り物</h6>
      <v-data-table no-data-text="余ったアイテムはありません" :items="leftovers"
                    :headers="[{ text: 'アイテム', value: 'アイテム名'}]"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
          </td>
          <td>
            {{r.item.個数}}個
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import ItemButton from '../ItemButton.vue'
import RecipeButton from '../RecipeButton.vue'
import { baseURL, getCall, postCall } from '../rest'

export default {
  name: 'recipe-result-step',
  props: ['targets'],
  data: () => ({
    recipes: [],
    items: [],
    leftovers: [],
  }),
  computed: {
    targets_: function() {
      return this.targets.filter(t => t.個数 > 0)
    },
  },
  watch: {
    // targets_: function() {
    //   if (this.targets_.length > 0) {
    //     postCall(baseURL+'/menu-recipes/preparation', {
    //       "作成アイテム": this.targets_.map(t => t.アイテム名)
    //     }, (xhr) => {
    //       if (xhr.readyState == 4 && xhr.status == 200) {
    //         let ret = JSON.parse(xhr.response)
    //         this.recipes = ret.必要レシピ
    //         this.items = ret.必要素材
    //         this.leftovers = ret.必要素材
    //       } else if (xhr.status == 404) {
            
    //       }
    //     })
    //   }
    // },
    targets_: function() {
      if (this.targets_.length > 0) {
        let items = this.targets_.reduce(
          (o, it) => Object.assign(o, {[it.アイテム名]: it.個数}), {}
        )
        // console.log(items)
        postCall(baseURL+'/menu-recipes', {
          "作成アイテム": items,
          "所持アイテム": {},
          "使用レシピ": {},
          "直接調達アイテム": [],
        }, (xhr) => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            let ret = JSON.parse(xhr.response)
            this.recipes = ret.必要レシピ
            this.items = ret.必要素材
            this.leftovers = ret.余り物
          } else if (xhr.status == 404) {
            
          }
        })
      }
    },
  },
  methods: {
  },
  components: {
    ItemButton,
    RecipeButton,
  }
}
</script>

<style scope>
</style>
