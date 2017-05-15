<template>
  <v-card id="item-card">
    <v-toolbar>
      <v-toolbar-title v-text="item.アイテム名+'のアイテム情報'">
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-card-row>
        <table class="table-striped">
          <tbody>
            <tr>
              <th> 英名 </th>
              <td class="text-md-center"> {{detail.英名 == "" ? "わからん（´・ω・｀）" : detail.英名}} </td>
            </tr>
            <separator />
            <tr>
              <th> 重さ </th>
              <td class="text-md-right"> {{(detail.重さ+0.0).toFixed(2)}} </td>
            </tr>
            <tr>
              <th> NPC売却価格 </th>
              <td class="text-md-right"> {{detail.NPC売却価格}}g </td>
            </tr>
            <tr>
              <th> 転送可 </th>
              <td class="text-md-center"> {{detail.転送可 ? "はい" : "いいえ"}} </td>
            </tr>
            <tr>
              <th> スタック可 </th>
              <td class="text-md-center"> {{detail.スタック可 ? "はい" : "いいえ"}} </td>
            </tr>
            <tr v-if="detail.特殊条件.length > 0">
              <th> 特殊条件 </th>
              <td class="text-md-center" v-html="effectStr"></td>
            </tr>
            <tr v-if="detail.ペットアイテム.種別 != '犬も喰わない'">
              <th> ペットアイテム </th>
              <td class="text-md-center" v-text="petItemStr"></td>
            </tr>
            <tr v-if="detail.info.length > 0">
              <th> info </th>
              <td class="text-md-left" v-html="detail.info.replace(/\n/, '<br />')"></td>
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
        } else if (xhr.status==404) {
          this.detail = {
            アイテム名: this.item.アイテム名,
            英名: "",
            ペットアイテム: { 種別: '不明' }
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
    },
    closeDialog: function() {
      this.$emit('update:itemDlg', false)
    }
  },
  components: {
    Separator
  }
}
</script>

<style scoped>
</style>
