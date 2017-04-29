<template>
  <div id="item-card" class="row">
    <table class="table-striped">
      <tbody>
        <tr>
          <th scope="row" class="elem"> アイテム名 </th>
          <td class="elem" v-text="detail.アイテム名"></td>
        </tr>
        <tr>
          <th scope="row" class="elem"> 英名 </th>
          <td class="elem"> {{detail.英名 == "" ? "わからん（´・ω・｀）" : detail.英名}} </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> 重さ </th>
          <td class="elem"> {{(detail.重さ+0.0).toFixed(2)}} </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> NPC売却価格 </th>
          <td class="elem"> {{detail.NPC売却価格}}g </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> 転送可 </th>
          <td class="elem"> {{detail.転送可 ? "はい" : "いいえ"}} </td>
        </tr>
        <tr>
          <th scope="row" class="elem"> スタック可 </th>
          <td class="elem"> {{detail.スタック可 ? "はい" : "いいえ"}} </td>
        </tr>
        <tr v-if="detail.特殊条件.length > 0">
          <th scope="row" class="elem"> 特殊条件 </th>
          <td class="elem" v-html="effectStr"></td>
        </tr>
        <tr v-if="detail.ペットアイテム.種別 != '犬も喰わない'">
          <th scope="row" class="elem"> ペットアイテム </th>
          <td class="elem" v-text="petItemStr"></td>
        </tr>
        <tr v-if="detail.info.length > 0">
          <th scope="row" class="elem"> info </th>
          <td class="elem" v-html="detail.info.replace(/\n/, '<br />')"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { baseURL, restCall } from './rest'

export default {
  name: 'item-card',
  props: ['item'],
  data: () => ({
    detail: {},
    effectStr: '',
    petItemStr: '不明',
  }),
  watch: {
    item: function() {
      this.getDetail()
    }
  },
  methods: {
    getDetail: function() {
      restCall('GET', baseURL+this.item.詳細, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.detail = JSON.parse(xhr.response)
        } else if (xhr.readyState==404) {
          this.detail = {
            アイテム名: this.item.アイテム名,
            ペットアイテム: { 種別: 0 }
          }
        }
        this.updateItem()
      })
    },
    updateItem: function() {
      this.effectStr = this.detail.特殊条件.map(sp => sp.詳細).join('<br />')
      if (this.detail.ペットアイテム.種別 == '不明') {
        this.petItemStr = '不明'
      }
      else{
        this.petItemStr = this.detail.ペットアイテム.種別 + '(' + (this.detail.ペットアイテム.効果+0.0).toFixed(1)+')'
      }
    }
  }
}
</script>

<style scoped>
</style>
