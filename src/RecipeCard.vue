<template>
  <v-card id="recipe-card">
    <v-toolbar>
      <v-toolbar-title v-text="recipe.レシピ名+'のレシピ情報'">
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-card-row>
        <table>
          <tbody>
            <tr>
              <th class="text-xs-center"> 材料 </th>
              <th class="text-xs-center"> 個数 </th>
            </tr>
            <separator />
            <tr v-for="ing in recipe.材料">
              <td class="text-xs-center">
                <item-button :item="ing">
                </item-button>
              </td>
              <td class="text-xs-right" v-text="ing.個数"></td>
            </tr>
            <separator />
            <tr>
              <th class="text-xs-center"> 生成物 </th>
              <th class="text-xs-center"> 個数 </th>
            </tr>
            <separator />
            <tr v-for="prod in recipe.生成物">
              <td class="text-xs-center">
                <item-button :item="prod">
                </item-button>
              </td>
              <td class="text-xs-right" v-text="prod.個数"></td>
            </tr>
            <separator />
            <tr>
              <th class="text-xs-center"> テクニック </th>
              <td class="text-xs-center" v-text="techStr"></td>
            </tr>
            <tr>
              <th class="text-xs-center"> 必要スキル </th>
              <td class="text-xs-center" v-html="skillStr"></td>
            </tr>
            <tr>
              <th class="text-xs-center"> 収録バインダー </th>
              <td class="text-xs-center" v-if="binderStr == 'なし'">
                {{binderStr}}
              </td>
              <td class="text-xs-center" v-else>
                <v-btn class="small" light flat small>{{binderStr}}</v-btn>
              </td>
            </tr>
            <tr>
              <th class="text-xs-center"> レシピ必須 </th>
              <td class="text-xs-center"> {{recipe.レシピ必須 ? "はい" : "いいえ"}} </td>
            </tr>
            <tr>
              <th class="text-xs-center"> ルーレット </th>
              <td class="text-xs-center" v-html="rouletteStr"></td>
            </tr>
            <tr v-if="recipe.備考 != ''">
              <th class="text-xs-center"> 備考 </th>
              <td class="text-xs-left" v-text="recipe.備考"></td>
            </tr>
            <separator />
          </tbody>
        </table>
      </v-card-row>
      <v-card-row actions class="hidden-sm-and-up">
        <v-btn @click.native="closeDialog()" class="black--text">
          閉じる
        </v-btn>
      </v-card-row>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from 'lodash'
import Separator from './Separator.vue'
import ItemButton from './ItemButton.vue'
import { baseURL, restCall } from './rest'

export default {
  name: 'recipe-card',
  data: () => ({
    techStr: '',
    skillStr: '',
    binderStr: '',
    rouletteStr: '',
    itemDlg: false,
  }),
  computed: {
    recipe() {
      return this.$store.state.recipe
    },
  },
  watch: {
    recipe: function() {
      this.updateRecipe()
    }
  },
  methods: {
    updateRecipe: function() {
      this.techStr = this.recipe.テクニック.join(", ")
      const skills = ("必要スキル" in this.recipe) ? this.recipe.必要スキル : {}
      this.skillStr = Object.keys(skills).map(k => k+'('+(skills[k]+0.0).toFixed(1)+')').join("<br />")

      this.binderStr = (this.recipe.収録バインダー.length == 0) ? "なし" : this.recipe.収録バインダー.map(b => b.バインダー名).join("<br /")

      if (!this.recipe.ギャンブル型 && !this.recipe.ペナルティ型) {
        this.rouletteStr = "通常"
      } else {
        this.rouletteStr = [this.recipe.ギャンブル型 ? "ギャンブル型" : "",
                            this.recipe.ペナルティ型 ? "ペナルティ型" : ""].filter(s => s != "").join("<br />")
      }
    },
    closeDialog: function() {
      this.$emit('update:recipeDlg', false)
    }
  },
  components: {
    Separator,
    ItemButton
}
}
</script>

<style scoped>
  table.table tbody td:first-child, table.table tbody td:not(:first-child),
  table.table tbody th:first-child, table.table tbody th:not(:first-child) {
    height: 0px;
    padding: 0 0px;
  }
</style>
