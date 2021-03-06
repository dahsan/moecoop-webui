<template>
<div id="select-recipe-step">
  <v-layout>
    <v-flex md12>
      作成候補
      <v-data-table :items="targets"
                    :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
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
    <v-flex md12>
      <p class="text-xs-left mb-0" v-if="loadingItems">
        作成方法
        <v-progress-circular indeterminate color="primary">
        </v-progress-circular>
      </p>
      <p class="text-xs-left mt-3 mb-0" v-else>
        作成方法
      </p>
      <v-data-table :items="Object.keys(choiceMap)"
                    :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                    :pagination.sync="pagination"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td class="text-md-center">
            {{r.item}} の作成方法
            <v-radio-group class="pt-1" v-model="choiceMap[r.item]">
              <template v-if="r.item in recipePreference">
                <v-radio v-for="r1 in recipeOptions[r.item]"
                         :label="r1" :value="r1" :key="r1"
                         @change="setPreference(r.item, r1)">
                </v-radio>
              </template>
              <v-radio v-else label="自分で作る" value="自分で作る"
                       @change="setPreference(r.item, '自分で作る')">
              </v-radio>
              <v-radio label="買ってくる" value="買ってくる"
                       @change="setPreference(r.item, '買ってくる')">
              </v-radio>
            </v-radio-group>
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout>
    <v-flex md12>
      <p class="text-xs-left mb-0" v-if="loadingItems">
        手持ちの素材
        <v-progress-circular indeterminate color="primary">
        </v-progress-circular>
      </p>
      <p class="text-xs-left mt-3 mb-0" v-else>
        手持ちの素材
      </p>

      <v-data-table :items="items"
                    :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                    :pagination.sync="pagination"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td class="text-xs-center">
            <item-button both :item="r.item">
            </item-button>
            <v-text-field class="pt-0 numField hidden-sm-and-up" :min="0" :max="r.item.個数" :suffix="'/'+String(r.item.個数)+'個'" type="number"
                          mask="######" v-model="owned[r.item.アイテム名]">
            </v-text-field>
          </td>
          <td class="hidden-xs-only">
            <v-text-field class="pt-0 numField" :min="0" :max="r.item.個数" :suffix="'/'+String(r.item.個数)+'個'" type="number"
                          mask="######" v-model="owned[r.item.アイテム名]">
            </v-text-field>
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout>
    <v-spacer></v-spacer>
    <v-btn small @click.native="setStep(1)">
      最初からやり直す
    </v-btn>
    <v-btn color="primary" @click.native="gotoResult()">
      作成する
    </v-btn>
  </v-layout>
</div>
</template>

<script>
import ItemButton from '../ItemButton.vue'
import RecipeButton from '../RecipeButton.vue'
import { baseURL, getCall, postCall } from '../rest'

export default {
  name: 'select-recipe-step',
  props: ['targets', 'step'],
  data: () => ({
    recipes: [],
    items: [],
    recipeOptions: {},
    itemCandidates: {},
    owned: {},
    loadingItems: false,
    pagination: { sortBy: null, rowsPerPage: -1 },
  }),
  mounted: function() {
    getCall(baseURL+'/menu-recipes/options', (xhr) => {
      if (xhr.readyState==4 && xhr.status==200) {
        JSON.parse(xhr.response)['選択可能レシピ'].forEach((elm, i, a) => {
          this.recipeOptions[elm['生産アイテム']['アイテム名']] = elm['レシピ候補'].map((e, i, a) => e['レシピ名'])
        })
      }
    })
  },
  computed: {
    recipePreference() {
      return this.$store.state.recipePreference
    },
    leafItems() {
      return this.$store.state.leafItems
    },
    choiceMap() {
      let map = {}
      this.items
        .filter((elm, i, a) => {
          return !this.targets.find(e => e.アイテム名 == elm.アイテム名) &&
            (elm.アイテム名 in this.itemCandidates) &&
            this.itemCandidates[elm.アイテム名].追加情報.中間素材
        }).forEach((elm, i, a) => {
          let name = elm.アイテム名
          if (this.leafItems.find(it => it == name)) {
            map[name] = "買ってくる"
          } else if (name in this.recipePreference) {
            map[name] = this.recipePreference[name]
          } else {
            map[name] = "自分で作る"
          }
        })
      return map
    },
    validOwned() {
      return Object.keys(this.owned).filter((elm, i, a) => Number(this.owned[elm]) > 0).reduce(
        (o, it) => Object.assign(o, {[it]: Number(this.owned[it])}), {}
      )
    },
  },
  watch: {
    step: function() {
      if (this.step == 2) {
        this.getCandidates()
        this.reload()
      }
    },
    recipePreference: function() {
      this.reload()
    },
    leafItems: function() {
      this.reload()
    },
  },
  methods: {
    reload: function() {
      let items = this.targets.reduce(
        (o, it) => Object.assign(o, {[it.アイテム名]: it.個数}), {}
      )

      this.loadingItems = true
      postCall(baseURL+'/menu-recipes', {
        "作成アイテム": items,
        "所持アイテム": this.validOwned,
        "使用レシピ": this.recipePreference,
        "直接調達アイテム": this.leafItems,
      }, (xhr) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let ret = JSON.parse(xhr.response)
          this.recipes = ret.必要レシピ
          this.items = ret.必要素材.filter((elm, i, a) => !this.targets.find(e => e.アイテム名 == elm.アイテム名))
          this.items.forEach((elm, i, a) => {
            if (elm.アイテム名 in this.owned) {
              this.owned[elm.アイテム名] = Math.min(elm.個数, this.owned[elm.アイテム名])
            }
          })
          this.loadingItems = false
        } else if (xhr.status == 404) {
        }
      })
    },
    getCandidates: function() {
      postCall(baseURL+'/menu-recipes/preparation', {
        "作成アイテム": this.targets.map((e, i, a) => e.アイテム名),
      }, (xhr) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let ret = JSON.parse(xhr.response).必要素材.reduce(
            (o, it) => Object.assign(o, {[it.アイテム名]: it}), {}
          )
          this.itemCandidates = ret
        }
      })
    },
    setPreference: function(it, r) {
      switch (r) {
      case "買ってくる":
        if (!this.leafItems.find((e, i, a) => e == it)) {
          this.$store.dispatch('addLeafItem', it)
        }
        break;
      case "自分で作る":
        if (this.leafItems.find((e, i, a) => e == it)) {
          this.$store.dispatch('removeLeafItem', it)
        }
        break;
      default:
        if (this.leafItems.find((e, i, a) => e == it)) {
          this.$store.dispatch('removeLeafItem', it).then(() => {
            this.$store.dispatch('setRecipePreference', { item: it, recipe: r })
          })
        } else {
          this.$store.dispatch('setRecipePreference', { item: it, recipe: r })
        }
        break;
      }
    },
    setStep: function(n) {
      this.$emit('update:step', n)
    },
    gotoResult: function() {
      this.$emit('setOwned', Object.assign({}, this.validOwned))
      this.$emit('update:step', 3)
    },
  },
  components: {
    ItemButton,
    RecipeButton,
  }
}
</script>

<style scoped>
  .numField {
    width: 130px;
    margin: 0 auto;
  }
</style>
