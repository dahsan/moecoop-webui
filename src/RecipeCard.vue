<template>
  <div id="recipe-card" class="row">
    <table class="table-striped">
      <thead>
        <tr>
          <th> 材料 </th>
          <th> 個数 </th>
        </tr>
        <tr class="sep"><th></th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="ing in detail.材料">
          <td> {{ing.アイテム名}} </td>
          <td> {{ing.個数}} </td>
        </tr>
        <tr class="sep"> <th></th><th></th></tr>
        <tr class="sep"> <th></th><th></th></tr>
        <tr>
          <th class="elem"> 生成物 </th>
          <th class="elem"> 個数 </th>
        </tr>
        <tr v-for="prod in detail.生成物">
          <td> {{prod.アイテム名}} </td>
          <td> {{prod.個数}} </td>
        </tr>
        <tr class="sep"> <th></th><th></th></tr>
        <tr class="sep"> <th></th><th></th></tr>
        <tr>
          <th scope="row" class="elem"> テクニック </th>
          <td class="elem"> {{techStr}} </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> 必要スキル </th>
          <td class="elem"> {{skillStr}} </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> 収録バインダー </th>
          <td class="elem"> {{binderStr}} </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> レシピ必須 </th>
          <td class="elem"> {{detail.レシピ必須 ? "はい" : "いいえ"}} </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> ルーレット </th>
          <td class="elem"> {{rouletteStr}} </td>
        </tr>
        <tr v-if="detail.備考 != ''">
          <th scope="row" class="elem"> 備考 </th>
          <td class="elem"> {{detail.備考}} </td>
        </tr>
      </tbody>
    </table>
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
      const skills = ("必要スキル" in this.detail) ? this.detail.必要スキル : {}
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
  .sep {
    background-color: black;
  }
  .elem {
    background-color: white;
  }
</style>
