<template>
  <div id="recipe-card">
    <table>
      <thead>
        <tr>
          <th> 材料 </th>
          <th> 個数 </th>
        </tr>
        <separator />
      </thead>
      <tbody>
        <tr v-for="ing in detail.材料">
          <td class="text-md-center" v-text="ing.アイテム名"></td>
          <td class="text-md-right" v-text="ing.個数"></td>
        </tr>
        <separator />
        <tr>
          <th> 生成物 </th>
          <th> 個数 </th>
        </tr>
        <separator />
        <tr v-for="prod in detail.生成物">
          <td class="text-md-center" v-text="prod.アイテム名"></td>
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
          <td class="text-md-center" v-html="binderStr"></td>
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
  </div>
</template>

<script>
import { baseURL, restCall } from './rest'
import Separator from './Separator.vue'

export default {
  name: 'recipe-card',
  props: ['recipe'],
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
      this.skillStr = Object.keys(skills).map(k => k+'('+(skills[k]+0.0).toFixed(1)+')').join("<br />")

      this.binderStr = (this.detail.収録バインダー.length == 0) ? "なし" : this.detail.収録バインダー.map(b => b.バインダー名).join("<br /")

      if (!this.detail.ギャンブル型 && !this.detail.ペナルティ型) {
        this.rouletteStr = "通常"
      } else {
        this.rouletteStr = [this.detail.ギャンブル型 ? "ギャンブル型" : "",
                            this.detail.ペナルティ型 ? "ペナルティ型" : ""].filter(s => s != "").join("<br />")
      }
    }
  },
  components: {
    Separator
  }
}
</script>

<style scoped>
</style>
