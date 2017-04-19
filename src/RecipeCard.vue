<template>
  <div id="recipe-card" v-if="recipe.レシピ名 != undefined">
    <b-card :header="detail.レシピ名 + 'のレシピ情報'">
      <b-table striped :items="detail.材料" :fields="ingFields">
      </b-table>

      <b-table striped :items="detail.生成物" :fields="prodFields">
      </b-table>

      <table>
        <tbody>
          <tr>
            <th scope="row"> テクニック </th>
            <td> {{techStr}} </td>
          </tr>
          <tr>
            <th scope="row"> 必要スキル </th>
            <td> {{skillStr}} </td>
          </tr>
          <tr>
            <th scope="row"> 収録バインダー </th>
            <td> {{binderStr}} </td>
          </tr>
          <tr>
            <th scope="row"> レシピ必須 </th>
            <td> {{detail.レシピ必須 ? "はい" : "いいえ"}} </td>
          </tr>
          <tr>
            <th scope="row"> ルーレット </th>
            <td> {{rouletteStr}} </td>
          </tr>
          <tr v-if="detail.備考 != ''">
            <th scope="row"> 備考 </th>
            <td> {{detail.備考}} </td>
          </tr>
        </tbody>
      </table>
    </b-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { baseURL, restCall } from './rest'

export default {
  name: 'recipe-card',
  props: ['recipe'],
  data: function() {
    return {
      detail: {},
      techStr: '',
      skillStr: '',
      binderStr: '',
      rouletteStr: '',
      ingFields: {
        アイテム名: {
          label: '材料'
        },
        個数: {
          label: '個数'
        }
      },
      prodFields: {
        アイテム名: {
          label: '生成物'
        },
        個数: {
          label: '個数'
        }
      }
    }
  },
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
        } else if (xhr.readyState==404) {
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
      var skills = ("必要スキル" in this.detail) ? this.detail.必要スキル : {}
      this.skillStr = Object.keys(skills).map(k => k+": "+(skills[k]+0.0).toFixed(1)).join(", ")

      this.binderStr = (this.detail.収録バインダー.length == 0) ? "なし" : this.detail.収録バインダー.map(b => b.バインダー名).join(", ")

      if (!this.detail.ギャンブル型 && !this.detail.ペナルティ型) {
        this.rouletteStr = "通常"
      } else {
        this.rouletteStr = [this.detail.ギャンブル型 ? "ギャンブル型" : "",
                            this.detail.ペナルティ型 ? "ペナルティ型" : ""].filter(s => s != "").join(", ")
      }
    }
  }
}
</script>

<style scoped>
</style>
