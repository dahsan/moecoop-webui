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
              <th> 材料 </th>
              <th> 個数 </th>
            </tr>
            <separator />
            <tr v-for="ing in detail.材料">
              <td class="text-md-center">
                <v-btn @click.native="updateItem(ing)" class="small hidden-xs-only" light flat small>{{ing.アイテム名}}</v-btn>
                <v-dialog v-model="itemDlg" fullscreen :overlay=false persistent class="hidden-sm-and-up">
                  <v-btn light flat slot="activator" @click.native="updateItem(ing)">{{ing.アイテム名}}</v-btn>
                  <item-card :item="item" :itemDlg.sync="itemDlg">
                  </item-card>
                </v-dialog>
              </td>
              <td class="text-md-right" v-text="ing.個数"></td>
            </tr>
            <separator />
            <tr>
              <th> 生成物 </th>
              <th> 個数 </th>
            </tr>
            <separator />
            <tr v-for="prod in detail.生成物">
              <td class="text-md-center">
                <v-btn @click.native="updateItem(prod)" class="small hidden-xs-only" light flat small>{{prod.アイテム名}}</v-btn>
                <v-dialog v-model="itemDlg" fullscreen :overlay=false persistent class="hidden-sm-and-up">
                  <v-btn light flat slot="activator" @click.native="updateItem(prod)">{{prod.アイテム名}}</v-btn>
                  <item-card :item="item" :itemDlg.sync="itemDlg">
                  </item-card>
                </v-dialog>
              </td>
              <td class="text-md-right" v-text="prod.個数"></td>
            </tr>
            <separator />
            <tr>
              <th> テクニック </th>
              <td class="text-md-center" v-text="techStr"></td>
            </tr>
            <tr>
              <th> 必要スキル </th>
              <td class="text-md-center" v-html="skillStr"></td>
            </tr>
            <tr>
              <th> 収録バインダー </th>
              <td class="text-md-center" v-if="binderStr == 'なし'">
                {{binderStr}}
              </td>
              <td class="text-md-center" v-else>
                <v-btn class="small" light flat small>{{binderStr}}</v-btn>
              </td>
            </tr>
            <tr>
              <th> レシピ必須 </th>
              <td class="text-md-center"> {{detail.レシピ必須 ? "はい" : "いいえ"}} </td>
            </tr>
            <tr>
              <th> ルーレット </th>
              <td class="text-md-center" v-html="rouletteStr"></td>
            </tr>
            <tr v-if="detail.備考 != ''">
              <th> 備考 </th>
              <td class="text-md-center" v-text="detail.備考"></td>
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
import ItemCard from './ItemCard.vue'
import { baseURL, restCall } from './rest'

export default {
  name: 'recipe-card',
  props: ['recipe', 'item'],
  data: () => ({
    detail: {
      レシピ名: 'わからん',
      テクニック: ['わからん'],
      必要スキル: { 'わからん': 0 },
      収録バインダー: [{バインダー名: 'わからん'}],
      レシピ必須: false,
      材料: { 'わからん': 0 },
      生成物: { 'わからん': 0 },
      備考: 'よくわからん(´・ω・`)',
    },
    techStr: '',
    skillStr: '',
    binderStr: '',
    rouletteStr: '',
    itemDlg: false,
  }),
  watch: {
    recipe: function() {
      this.getDetail()
    }
  },
  methods: {
    getDetail: function() {
      restCall('GET', baseURL+this.recipe.詳細, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.detail = JSON.parse(xhr.response)
        } else if (xhr.status==404) {
          this.detail = {
            レシピ名: this.recipe.レシピ名,
            テクニック: ['わからん'],
            必要スキル: { 'わからん': 0 },
            収録バインダー: [{バインダー名: 'わからん'}],
            レシピ必須: false,
            材料: { 'わからん': 0 },
            生成物: { 'わからん': 0 },
            備考: 'よくわからん(´・ω・`)',
          }
        }
        this.updateRecipe()
      })
    },
    updateRecipe: function() {
      this.techStr = this.detail.テクニック.join(", ")
      const skills = ("必要スキル" in this.detail) ? this.detail.必要スキル : {}
      this.skillStr = Object.keys(skills).map(k => k+'('+(skills[k]+0.0).toFixed(1)+')').join("<br />")

      this.binderStr = (this.detail.収録バインダー.length == 0) ? "なし" : this.detail.収録バインダー.map(b => b.バインダー名).join("<br /")

      if (!this.detail.ギャンブル型 && !this.detail.ペナルティ型) {
        this.rouletteStr = "通常"
      } else {
        this.rouletteStr = [this.detail.ギャンブル型 ? "ギャンブル型" : "",
                            this.detail.ペナルティ型 ? "ペナルティ型" : ""].filter(s => s != "").join("<br />")
      }
    },
    updateItem: function(it) {
      this.$emit('update:item', it)
    },
    closeDialog: function() {
      this.$emit('update:recipeDlg', false)
    }
  },
  components: {
    Separator,
    ItemCard
  }
}
</script>

<style scoped>
  table.table tbody th {
    text-align: center;
  }
  table.table tbody td:first-child, table.table tbody td:not(:first-child),
  table.table tbody th:first-child, table.table tbody th:not(:first-child) {
    height: 0px;
    padding: 0 0px;
  }
  .small {
    margin: 0px;
    padding: 0 0px;
  }
</style>
