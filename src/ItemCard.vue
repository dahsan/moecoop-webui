<template>
  <v-card id="item-card">
    <v-card-title>
      <v-progress-circular v-if="loadingItem" indeterminate color="primary">
      </v-progress-circular>
      {{item.アイテム名+'のアイテム情報'}}
      <v-spacer></v-spacer>
      <v-btn flat small icon class="small hidden-xs-only" @click.native="initItem()">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-divider v-if="!useSimpleMode"/>
      <v-layout v-if="!useSimpleMode">
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
          {{(price != null) ? price : item.参考価格}} g
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          調達価格
        </v-flex>
        <v-flex md4 class="text-md-center">
          <v-text-field class="pt-0" min="0" maxlength="8" suffix="g" type="number" mask="###########" v-model="price"></v-text-field>
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

      <v-layout v-if="item.info.length > 0 && !useSimpleMode">
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
import { baseURL, postCall } from './rest'
import _ from 'lodash'

export default {
  name: 'item-card',
  methods: {
    initItem: function() {
      this.$store.commit('initItem')
    },
  },
  computed: {
    item() {
      return this.$store.state.item
    },
    useSimpleMode() {
      return this.$store.state.useSimpleMode
    },
    loadingItem() {
      return this.$store.state.loadingItem
    },
    effectStr() {
      return this.item.特殊条件.map(sp => sp.詳細).join('<br />')
    },
    petItemStr() {
      if (this.item.ペットアイテム.種別 == '不明') {
        return '不明'
      }
      else{
        return this.item.ペットアイテム.種別 + '(' + (this.item.ペットアイテム.効果+0.0).toFixed(1)+')'
      }
    },
    detail() {
      switch(this.item.アイテム種別) {
      case '食べ物':
      case '飲み物':
      case '酒':
        return this.foodDetail
      case '消耗品':
        return []
      case '武器':
        return this.weaponDetail
      case '防具':
        return this.armorDetail
      case '弾':
        return this.bulletDetail
      case '盾':
        return this.shieldDetail
      case 'アセット':
        return []
      case 'その他':
      case '不明':
      default:
        return []
      }
    },
    foodDetail() {
      let ret = []
      const info = this.item.飲食物情報
      if (info) {
        ret.push({caption: '効果', value: (info.効果+0.0).toFixed(1)})
        if (info.付加効果 != null) {
          if (info.付加効果.バフグループ == '') {
            ret.push({caption: '付加効果', value: info.付加効果.バフ名})
          } else {
            const eff = info.付加効果.効果
            var effStrs = Object.keys(eff).map(e => e+': '+ (eff[e] > 0 ? '+' : '') + eff[e])
            if (info.付加効果.その他効果 != '')
            {
              effStrs.push(info.付加効果.その他効果)
            }
            ret.push({caption: '付加効果', value: info.付加効果.バフ名+"<br />"+effStrs.join(', ')})
            ret.push({caption: 'バフグループ', value: info.付加効果.バフグループ})
            ret.push({caption: '効果時間', value: info.付加効果.効果時間+' 秒'})
          }
        }
      }
      return ret
    },
    weaponDetail() {
      let ret = []
      const info = this.item.武器情報
      if (info) {
        ret.push({caption: 'ダメージ', value: info.攻撃力.map(at => at.状態+': '+(at.効果+0.0).toFixed(1)).join(', ')})
        ret.push({caption: '攻撃間隔', value: info.攻撃間隔})
        ret.push({caption: '有効レンジ', value: (info.有効レンジ+0.0).toFixed(1)})
        ret.push({caption: info.消耗タイプ, value: info.耐久})
        ret.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
        ret.push({caption: '装備スロット', value: info.装備スロット+' ('+(info.両手装備 ? '両手' : '片手')+')'})
        ret.push({caption: '素材', value: info.素材})
        if (info.装備可能シップ[0].シップ名 != 'なし') {
          ret.push({caption: '装備可能シップ', value: info.装備可能シップ.map(s => s.シップ名+'系').join(', ')})
        }

        if (Object.keys(info.付加効果).length > 0) {
          const eff = info.付加効果
          ret.push({caption: '付加効果', value: Object.keys(eff).map(k => k+': '+eff[k]+' %').join(', ')})
        }

        if (Object.keys(info.追加効果).length > 0) {
          const eff = info.追加効果
          ret.push({
            caption: '追加効果',
            value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
          })
        }

        if (info.効果アップ.length > 0) {
          ret.push({caption: '効果アップ', value: info.効果アップ.join(', ')})
        }

        if (info.魔法チャージ) {
          ret.push({caption: '魔法チャージ', value: '可能'})
        }
        if (info.属性チャージ) {
          ret.push({caption: '属性チャージ', value: '可能'})
        }
      }
      return ret
    },
    armorDetail() {
      let ret = []
      const info = this.item.防具情報
      if (info) {
        ret.push({caption: 'アーマークラス', value: info.アーマークラス.map(at => at.状態+': '+(at.効果+0.0).toFixed(1)).join(', ')})
        ret.push({caption: info.消耗タイプ, value: info.耐久})
        ret.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
        ret.push({caption: '装備スロット', value: info.装備スロット})
        ret.push({caption: '素材', value: info.素材})
        if (info.装備可能シップ[0].シップ名 != 'なし') {
          ret.push({caption: '装備可能シップ', value: info.装備可能シップ.map(s => s.シップ名+'系').join(', ')})
        }

        if (info.付加効果 != '') {
          ret.push({caption: '付加効果', value: info.付加効果})
        }

        if (Object.keys(info.追加効果).length > 0) {
          const eff = info.追加効果
          ret.push({
            caption: '追加効果',
            value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
          })
        }

        if (info.効果アップ.length > 0) {
          ret.push({caption: '効果アップ', value: info.効果アップ.join(', ')})
        }

        if (info.魔法チャージ) {
          ret.push({caption: '魔法チャージ', value: '可能'})
        }
        if (info.属性チャージ) {
          ret.push({caption: '属性チャージ', value: '可能'})
        }
      }
      return ret
    },
    bulletDetail() {
      let ret = []
      const info = this.item.弾情報
      if (info) {
        ret.push({caption: 'ダメージ', value: (info.ダメージ+0.0).toFixed(1)})
        ret.push({caption: 'ダメージ', value: (info.有効レンジ+0.0).toFixed(1)})
        ret.push({caption: '角度補正角', value: info.角度補正角})
        ret.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
        ret.push({caption: '装備スロット', value: '矢/弾'})
        if (info.使用可能シップ[0].シップ名 != 'なし') {
          ret.push({caption: '使用可能シップ', value: info.使用可能シップ.map(s => s.シップ名+'系').join(', ')})
        }

        if (Object.keys(info.追加効果).length > 0) {
          const eff = info.追加効果
          ret.push({
            caption: '追加効果',
            value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
          })
        }

        if (info.付与効果 != '') {
          ret.push({caption: '付与効果', value: info.付与効果})
        }
      }
      return ret
    },
    shieldDetail() {
      let ret = []
      const info = this.item.盾情報
      if (info) {
        ret.push({caption: 'アーマークラス', value: info.アーマークラス.map(at => at.状態+': '+(at.効果+0.0).toFixed(1)).join(', ')})
        ret.push({caption: info.消耗タイプ, value: info.耐久})
        ret.push({caption: '必要スキル', value: info.必要スキル.map(sk => sk.スキル名+' ('+(sk.スキル値+0.0).toFixed(1)+')').join(', ')})
        ret.push({caption: '回避', value: info.回避+ ' %'})
        ret.push({caption: '素材', value: info.素材})
        if (info.使用可能シップ[0].シップ名 != 'なし') {
          ret.push({caption: '使用可能シップ', value: info.使用可能シップ.map(s => s.シップ名+'系').join(', ')})
        }

        if (info.付加効果 != '') {
          ret.push({caption: '付加効果', value: info.付加効果})
        }

        if (Object.keys(info.追加効果).length > 0) {
          const eff = info.追加効果
          ret.push({
            caption: '追加効果',
            value: Object.keys(eff).map(k => k+': '+(eff[k] > 0 ? '+' : '')+(eff[k]+0.0).toFixed(1)).join(', ')
          })
        }

        if (info.効果アップ.length > 0) {
          ret.push({caption: '効果アップ', value: info.効果アップ.join(', ')})
        }

        if (info.魔法チャージ) {
          ret.push({caption: '魔法チャージ', value: '可能'})
        }
        if (info.属性チャージ) {
          ret.push({caption: '属性チャージ', value: '可能'})
        }
      }
      return ret
    },
    price: {
      get: function() {
        if (this.item == null || this.item.アイテム名 == '') {
          return null
        } else {
          return this.$store.state.prices[this.item.アイテム名]
        }
      },
      set: function(val) {
        if (val == '') {
          this.$store.dispatch('deletePrice', this.item.アイテム名)
        } else {
          this.$store.dispatch('setPrice', { item: this.item.アイテム名, price: Number(val) })
        }
      }
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
