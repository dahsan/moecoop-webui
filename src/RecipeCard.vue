<template>
  <div id="recipe-card" v-if="recipe.レシピ名 != undefined">
    <b-card :header="detail.レシピ名 + 'のレシピ情報'">
      <b-form-fieldset label="テクニック">
        {{techStr}}
      </b-form-fieldset>
      <b-form-fieldset label="必要スキル">
        {{skillStr}}
      </b-form-fieldset>
      <b-form-fieldset>
        <b-table striped :items="detail.材料" :fields="ingFields">
        </b-table>
      </b-form-fieldset>
      <b-form-fieldset>
        <b-table striped :items="detail.生成物" :fields="prodFields">
        </b-table>
      </b-form-fieldset>
      <b-form-fieldset label="収録バインダー">
        {{binderStr}}
      </b-form-fieldset>
      <!-- <b-form-fieldset label="所持キャラクター"> -->
      <!--   {{skillStr}} -->
      <!-- </b-form-fieldset> -->
      <b-form-fieldset label="レシピ必須">
        {{detail.レシピ必須 ? "はい" : "いいえ"}}
      </b-form-fieldset>
      <b-form-fieldset label="ルーレット">
        {{rouletteStr}}
      </b-form-fieldset>
      <b-form-fieldset label="備考" v-if="detail.備考 != ''">
        {{detail.備考}}
      </b-form-fieldset>
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
      var that = this
      restCall('GET', baseURL+this.recipe.詳細, function(xhr) {
        if (xhr.readyState==4 && xhr.status==200) {
          that.detail = JSON.parse(xhr.response)
        } else if (xhr.readyState==404) {
          that.detail = {
            レシピ名: that.recipe.レシピ名,
            テクニック: ['わからん'],
            必要スキル: { 'わからん': 0 },
            収録バインダー: [{バインダー名: 'わからん'}],
            レシピ必須: false,
            材料: { 'わからん': 0 },
            生成物: { 'わからん': 0 },
            備考: 'よくわからん(´・ω・`)',
          }
        }
        that.updateRecipe()
      })
    },
    updateRecipe: function() {
      this.techStr = this.detail.テクニック.join(", ")
      var skills = ("必要スキル" in this.detail) ? this.detail.必要スキル : {}
      this.skillStr = Object.keys(skills).map(k => k+": "+(skills[k]+0.0).toFixed(1)).join(", ")

      this.binderStr = this.detail.収録バインダー.map(b => b.バインダー名).join(", ")

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
