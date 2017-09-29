<template>
  <v-card id="item-card">
    <v-card-title v-text="item.アイテム名+'のアイテム情報'">
    </v-card-title>

    <v-card-text>
      <v-divider />
      <v-layout>
        <v-flex md6 class="text-md-center caption">
          英名
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{item.英名 == "" ? "わからん（´・ω・｀）" : item.英名}}
        </v-flex>
      </v-layout>

      <v-divider />

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          重さ
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{(item.重さ+0.0).toFixed(2)}}
        </v-flex>
      </v-layout>

      <!-- 各アイテム種別ごとの詳細情報 -->
      <v-layout v-for="(elem, idx) in detail" :key="idx">
        <v-flex md6 class="text-md-center caption" v-text="elem.caption">
        </v-flex>
        <v-flex md6 class="text-md-center" v-html="elem.value">
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          NPC売却価格
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{item.NPC売却価格}} g
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          参考価格
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{item.参考価格}} g
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption" v-tooltip:left="{ html: 'まだ飾り！'}">
          調達価格
        </v-flex>
        <v-flex md4 class="text-md-center">
          <v-text-field light class="mt-0 mb-0" min="0" maxlength="8" suffix="g" type="number" disabled></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          転送可
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{item.転送可 ? "はい" : "いいえ"}}
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          スタック可
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{item.スタック可 ? "はい" : "いいえ"}}
        </v-flex>
      </v-layout>

      <v-layout v-if="item.レシピ.length > 0">
        <v-flex md6 class="text-md-center caption">
          レシピ
        </v-flex>
        <v-flex md6 class="text-md-center">
          <recipe-button :recipe="r" v-for="r in item.レシピ" :key="r.レシピ名">
          </recipe-button>
        </v-flex>
      </v-layout>

      <v-layout v-if="item.特殊条件.length > 0">
        <v-flex md6 class="text-md-center caption">
          特殊条件
        </v-flex>
        <v-flex md6 class="text-md-center" v-html="effectStr">
        </v-flex>
      </v-layout>

      <v-layout v-if="item.ペットアイテム.種別 != '犬も喰わない'">
        <v-flex md6 class="text-md-center caption">
          ペットアイテム
        </v-flex>
        <v-flex class="text-md-center" v-text="petItemStr">
        </v-flex>
      </v-layout>

      <v-layout v-if="item.info.length > 0">
        <v-flex md6 class="text-md-center caption">
          info
        </v-flex>
        <v-flex class="text-xs-center" v-html="item.info.replace(/\n/, '<br />')">
        </v-flex>
      </v-layout>

      <v-layout v-if="item.備考.length > 0">
        <v-flex md6 class="text-md-center caption">
          備考
        </v-flex>
        <v-flex class="text-md-center" v-html="item.備考.replace(/\n/, '<br />')">
        </v-flex>
      </v-layout>

      <v-divider />
    </v-card-text>
  </v-card>
</template>

<script>
import RecipeButton from './RecipeButton.vue'
import _ from 'lodash'

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
        if (info) {
          this.detail.push({caption: '効果', value: (info.効果+0.0).toFixed(1)})
          if (info.付加効果 != null) {
            if (info.付加効果.バフグループ == '') {
              this.detail.push({caption: '付加効果', value: info.付加効果.バフ名})
            } else {
              const eff = info.付加効果.効果
              var effStrs = Object.keys(eff).map(e => e+': '+ (eff[e] > 0 ? '+' : '') + eff[e])
              if (info.付加効果.その他効果 != '')
              {
                effStrs.push(info.付加効果.その他効果)
              }
              this.detail.push({caption: '付加効果', value: info.付加効果.バフ名+"<br />"+effStrs.join(', ')})
              this.detail.push({caption: 'バフグループ', value: info.付加効果.バフグループ})
              this.detail.push({caption: '効果時間', value: info.付加効果.効果時間+' 秒'})
            }
          }
        }
        break
      }
      case '消耗品':{
        // TODO
        break
      }
      case '武器':{
        const info = this.item.武器情報
        if (info) {
          this.detail.push({caption: 'ダメージ', value: info.攻撃力.map(at => at.状態+': '+(at.効果+0.0).toFixed(1)).join(', ')})
          this.detail.push({caption: '攻撃間隔', value: info.攻撃間隔})
          this.detail.push({caption: '有効レンジ', value: (info.有効レンジ+0.0).toFixed(1)})
          this.detail.push({caption: info.消耗タイプ, value: info.耐久})
          this.detail.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
          this.detail.push({caption: '装備スロット', value: info.装備スロット+' ('+(info.両手装備 ? '両手' : '片手')+')'})
          this.detail.push({caption: '素材', value: info.素材})
          if (info.装備可能シップ[0].シップ名 != 'なし') {
            this.detail.push({caption: '装備可能シップ', value: info.装備可能シップ.map(s => s.シップ名+'系').join(', ')})
          }

          if (Object.keys(info.付加効果).length > 0) {
            const eff = info.付加効果
            this.detail.push({caption: '付加効果', value: Object.keys(eff).map(k => k+': '+eff[k]+' %').join(', ')})
          }

          if (Object.keys(info.追加効果).length > 0) {
            const eff = info.追加効果
            this.detail.push({
              caption: '追加効果',
              value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
            })
          }

          if (info.効果アップ.length > 0) {
            this.detail.push({caption: '効果アップ', value: info.効果アップ.join(', ')})
          }

          if (info.魔法チャージ) {
            this.detail.push({caption: '魔法チャージ', value: '可能'})
          }
          if (info.属性チャージ) {
            this.detail.push({caption: '属性チャージ', value: '可能'})
          }
        }
        break
      }
      case '防具':{
        const info = this.item.防具情報
        if (info) {
          this.detail.push({caption: 'アーマークラス', value: info.アーマークラス.map(at => at.状態+': '+(at.効果+0.0).toFixed(1)).join(', ')})
          this.detail.push({caption: info.消耗タイプ, value: info.耐久})
          this.detail.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
          this.detail.push({caption: '装備スロット', value: info.装備スロット})
          this.detail.push({caption: '素材', value: info.素材})
          if (info.装備可能シップ[0].シップ名 != 'なし') {
            this.detail.push({caption: '装備可能シップ', value: info.装備可能シップ.map(s => s.シップ名+'系').join(', ')})
          }

          if (info.付加効果 != '') {
            this.detail.push({caption: '付加効果', value: info.付加効果})
          }

          if (Object.keys(info.追加効果).length > 0) {
            const eff = info.追加効果
            this.detail.push({
              caption: '追加効果',
              value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
            })
          }

          if (info.効果アップ.length > 0) {
            this.detail.push({caption: '効果アップ', value: info.効果アップ.join(', ')})
          }

          if (info.魔法チャージ) {
            this.detail.push({caption: '魔法チャージ', value: '可能'})
          }
          if (info.属性チャージ) {
            this.detail.push({caption: '属性チャージ', value: '可能'})
          }
        }
        break
      }
      case '弾':{
        const info = this.item.弾情報
        if (info) {
          this.detail.push({caption: 'ダメージ', value: (info.ダメージ+0.0).toFixed(1)})
          this.detail.push({caption: 'ダメージ', value: (info.有効レンジ+0.0).toFixed(1)})
          this.detail.push({caption: '角度補正角', value: info.角度補正角})
          this.detail.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
          this.detail.push({caption: '装備スロット', value: '矢/弾'})
          if (info.使用可能シップ[0].シップ名 != 'なし') {
            this.detail.push({caption: '使用可能シップ', value: info.使用可能シップ.map(s => s.シップ名+'系').join(', ')})
          }

          if (Object.keys(info.追加効果).length > 0) {
            const eff = info.追加効果
            this.detail.push({
              caption: '追加効果',
              value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
            })
          }

          if (info.付与効果 != '') {
            this.detail.push({caption: '付与効果', value: info.付与効果})
          }
        }
        break
      }
      case '盾':{
        const info = this.item.盾情報
        if (info) {
          this.detail.push({caption: 'アーマークラス', value: info.アーマークラス.map(at => at.状態+': '+(at.効果+0.0).toFixed(1)).join(', ')})
          this.detail.push({caption: info.消耗タイプ, value: info.耐久})
          this.detail.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
          this.detail.push({caption: '回避', value: info.回避+ ' %'})
          this.detail.push({caption: '素材', value: info.素材})
          if (info.使用可能シップ[0].シップ名 != 'なし') {
            this.detail.push({caption: '使用可能シップ', value: info.使用可能シップ.map(s => s.シップ名+'系').join(', ')})
          }

          if (info.付加効果 != '') {
            this.detail.push({caption: '付加効果', value: info.付加効果})
          }

          if (Object.keys(info.追加効果).length > 0) {
            const eff = info.追加効果
            this.detail.push({
              caption: '追加効果',
              value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
            })
          }

          if (info.効果アップ.length > 0) {
            this.detail.push({caption: '効果アップ', value: info.効果アップ.join(', ')})
          }

          if (info.魔法チャージ) {
            this.detail.push({caption: '魔法チャージ', value: '可能'})
          }
          if (info.属性チャージ) {
            this.detail.push({caption: '属性チャージ', value: '可能'})
          }
        }
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
    RecipeButton
  }
}
</script>

<style scoped>
  .caption {
    font-weight: bold;
    font-family: sans-serif;
  }
</style>
