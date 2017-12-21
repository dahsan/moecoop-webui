<template>
<div id="recipe-result-step">
  <v-layout>
    <v-flex md12>
      作成アイテム
      <v-data-table :items="targets"
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
            {{r.item.個数}} 個
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout class="mt-1">
    <v-flex md12>
      使用するレシピ
      <v-data-table no-data-text="必要なレシピはありません" :items="recipes"
                    :headers="[{ text: 'レシピ', value: 'レシピ名'}]"
                    :pagination.sync="pagination"
                    rows-per-page-text="レシピ表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td class="text-md-center">
            <recipe-button both :recipe="r.item">
            </recipe-button>
          </td>
          <td>
            {{r.item.コンバイン数}} 回
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout class="mt-1">
    <v-flex md12>
      用意済みの素材
      <v-data-table no-data-text="必要なアイテムはありません" :items="items"
                    :headers="[{ text: 'アイテム', value: 'アイテム名'}]"
                    :pagination.sync="pagination"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td>
            <v-btn flat icon small :color="prepared[r.item.アイテム名] == r.item.個数-owned[r.item.アイテム名] ? 'green' : 'grey lighten-2'"
                   @click="prepared[r.item.アイテム名] = r.item.個数-owned[r.item.アイテム名]">
              <v-icon>check</v-icon>
            </v-btn>
          </td>
          <td class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
          </td>
          <td>
            <v-text-field class="pt-0 numField" v-model="prepared[r.item.アイテム名]" :suffix="suffixes[r.item.アイテム名]" type="number" :min="0" :max="r.item.個数-owned[r.item.アイテム名]">
            </v-text-field>
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout class="mt-1" v-if="leftovers.length > 0">
    <v-flex md12>
      余り物
      <v-data-table no-data-text="余ったアイテムはありません" :items="leftovers"
                    :headers="[{ text: 'アイテム', value: 'アイテム名'}]"
                    :pagination.sync="pagination"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
          </td>
          <td>
            {{r.item.個数}} 個
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout>
    <v-spacer></v-spacer>
    <v-btn small @click.native="setStep(2)">レシピ・使用素材を決め直す</v-btn>
    <v-btn small @click.native="setStep(1)">最初からやり直す</v-btn>
  </v-layout>
</div>
</template>

<script>
import ItemButton from '../ItemButton.vue'
import RecipeButton from '../RecipeButton.vue'
import { baseURL, getCall, postCall } from '../rest'

export default {
  name: 'recipe-result-step',
  props: ['targets', 'owned', 'step'],
  data: () => ({
    recipes: [],
    items: [],
    leftovers: [],
    prepared: {},
    loadingResult: false,
    pagination: { sortBy: null, rowsPerPage: -1 },
  }),
  computed: {
    recipePreference() {
      return this.$store.state.recipePreference
    },
    leafItems() {
      return this.$store.state.leafItems
    },
    suffixes() {
      return this.items.reduce(
        (o, it) => {
          let name = it.アイテム名
          let base = '/'+String(it.個数-this.owned[name])
          if (name in this.owned && this.owned[name] > 0) {
            base += '+'+String(this.owned[name])
          }
          base += ' 個'
          o[name] = base
          return o
        },
        {}
      )
    },
  },
  watch: {
    step: function() {
      if (this.step == 3) {
        this.load()
      }
    },
  },
  methods: {
    load: function() {
      let items = this.targets.reduce(
        (o, it) => Object.assign(o, {[it.アイテム名]: it.個数}), {}
      )

      this.loadingResult = true
      postCall(baseURL+'/menu-recipes', {
        "作成アイテム": items,
        "所持アイテム": this.owned,
        "使用レシピ": this.recipePreference,
        "直接調達アイテム": this.leafItems,
      }, (xhr) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let ret = JSON.parse(xhr.response)
          this.recipes = ret.必要レシピ
          this.items = ret.必要素材.filter((elm, i, a) => !this.targets.find(e => e.アイテム名 == elm.アイテム名))
          this.leftovers = ret.余り物
          this.loadingResult = false
          this.items.forEach((elm, i, a) => {
            if (!(elm.アイテム名 in this.owned)) {
              this.owned[elm.アイテム名] = 0
            }
          })
        } else if (xhr.status == 404) {
        }
      })
    },
    setStep: function(n) {
      this.$emit('update:step', n)
    },
  },
  components: {
    ItemButton,
    RecipeButton,
  }
}
</script>

<style scope>
  .numField {
    width: 130px;
    margin: 0 auto;
  }
</style>
