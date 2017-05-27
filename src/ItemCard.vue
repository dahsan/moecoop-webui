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
              <td class="text-md-center"> {{item.英名 == "" ? "わからん（´・ω・｀）" : item.英名}} </td>
            </tr>
            <separator />
            <tr>
              <th> 重さ </th>
              <td class="text-md-center"> {{(item.重さ+0.0).toFixed(2)}} </td>
            </tr>
            <tr v-for="elem in detail">
              <th v-text="elem.caption"></th><td class="text-md-center" v-text="elem.value"></td>
            </tr>
            <tr>
              <th> NPC売却価格 </th>
              <td class="text-md-center"> {{item.NPC売却価格}} g </td>
            </tr>
            <tr>
              <th> 転送可 </th>
              <td class="text-md-center"> {{item.転送可 ? "はい" : "いいえ"}} </td>
            </tr>
            <tr>
              <th> スタック可 </th>
              <td class="text-md-center"> {{item.スタック可 ? "はい" : "いいえ"}} </td>
            </tr>
            <tr v-if="item.特殊条件.length > 0">
              <th> 特殊条件 </th>
              <td class="text-md-center" v-html="effectStr"></td>
            </tr>
            <tr v-if="item.ペットアイテム.種別 != '犬も喰わない'">
              <th> ペットアイテム </th>
              <td class="text-md-center" v-text="petItemStr"></td>
            </tr>
            <tr v-if="item.info.length > 0">
              <th> info </th>
              <td class="text-md-left" v-html="item.info.replace(/\n/, '<br />')"></td>
            </tr>
            <tr v-if="item.備考.length > 0">
              <th> 備考 </th>
              <td class="text-md-left" v-html="item.備考.replace(/\n/, '<br />')"></td>
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
  data: () => ({
    effectStr: '',
    petItemStr: '不明',
    detail: [],
  }),
  computed: {
    item() {
      return this.$store.state.item
    }
  },
  watch: {
    item: function() {
      this.updateItem()
    }
  },
  methods: {
    updateItem: function() {
      this.effectStr = this.item.特殊条件.map(sp => sp.詳細).join('<br />')
      if (this.item.ペットアイテム.種別 == '不明') {
        this.petItemStr = '不明'
      }
      else{
        this.petItemStr = this.item.ペットアイテム.種別 + '(' + (this.item.ペットアイテム.効果+0.0).toFixed(1)+')'
      }
      this.updateDetail()
    },
    updateDetail: function() {
      this.detail = []
      switch(this.item.アイテム種別) {
      case '食べ物':
      case '飲み物':
      case '酒':{
        const info = this.item.飲食物情報
        this.detail.push({align: 'right', caption: '効果', value: (info.効果+0.0).toFixed(1)})
        if (info.付加効果 != null) {
          this.detail.push({align: 'center', caption: '付加効果', value: info.付加効果.バフ名})
          if (info.付加効果.バフグループ != '') {
            const eff = info.付加効果.効果
            var effStrs = Object.keys(eff).map(e => e+': '+ (eff[e] > 0 ? '+' : '') + eff[e])
            if (info.付加効果.その他効果 != '')
            {
              effStrs.push(info.付加効果.その他効果)
            }
            this.detail.push({align: 'center', caption: '', value: effStrs.join(', ')})
            this.detail.push({align: 'center', caption: 'バフグループ', value: info.付加効果.バフグループ})
            this.detail.push({align: 'center', caption: '効果時間', value: info.付加効果.効果時間+' 秒'})
          }
        }
        break
      }
      case '消耗品':{
        break
      }
      case '武器':{
        break
      }
      case '防具':{
        break
      }
      case '弾':{
        break
      }
      case '盾':{
        break
      }
      case 'アセット':{
        break
      }
      case 'その他':
      case '不明':
      default:
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
