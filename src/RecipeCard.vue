<template>
  <v-card id="recipe-card">
    <v-toolbar>
      <v-toolbar-title v-text="recipe.レシピ名+'のレシピ情報'">
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-card-row>
        <v-card-column class="header text-xs-center">
          材料
        </v-card-column>
        <v-card-column class="header text-xs-center">
          個数
        </v-card-column>
      </v-card-row>
      <v-divider />
      <v-card-row v-for="ing in recipe.材料" :key="ing.アイテム名">
        <v-card-column class="text-xs-center">
          <item-button :item="ing">
          </item-button>
        </v-card-column>
        <v-card-column class="text-xs-center" v-text="ing.個数">
        </v-card-column>
      </v-card-row>
      <v-divider />
      <v-card-row>
        <v-card-column class="header text-xs-center">
          生成物
        </v-card-column>
        <v-card-column class="header text-xs-center">
          個数
        </v-card-column>
      </v-card-row>
      <v-divider />
      <v-card-row v-for="prod in recipe.生成物" :key="prod.アイテム名">
        <v-card-column class="text-xs-center">
          <item-button :item="prod">
          </item-button>
        </v-card-column>
        <v-card-column class="text-xs-center" v-text="prod.個数">
        </v-card-column>
      </v-card-row>
      <v-divider />

      <v-card-row>
        <v-card-column class="header text-xs-center">
          テクニック
        </v-card-column>
        <v-card-column class="text-xs-center">
          {{recipe.テクニック.join(", ")}}
        </v-card-column>
      </v-card-row>

      <v-card-row>
        <v-card-column class="header text-xs-center">
          必要スキル
        </v-card-column>
        <v-card-column class="text-xs-center" v-html="skillStr">
        </v-card-column>
      </v-card-row>

      <v-card-row>
        <v-card-column class="header text-xs-center">
          収録バインダー
        </v-card-column>
        <v-card-column class="text-xs-center" v-html="binderStr">
        </v-card-column>
      </v-card-row>

      <v-card-row>
        <v-card-column class="header text-xs-center">
          レシピ必須
        </v-card-column>
        <v-card-column class="text-xs-center">
          {{recipe.レシピ必須 ? "はい" : "いいえ"}}
        </v-card-column>
      </v-card-row>

      <v-card-row>
        <v-card-column class="header text-xs-center">
          ルーレット
        </v-card-column>
        <v-card-column class="text-xs-center" v-text="rouletteStr">
        </v-card-column>
      </v-card-row>

      <v-card-row v-if="recipe.備考 != ''">
        <v-card-column class="header text-xs-center">
          備考
        </v-card-column>
        <v-card-column class="text-xs-center" v-text="recipe.備考">
        </v-card-column>
      </v-card-row>
      <v-divider />

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
import ItemButton from './ItemButton.vue'

export default {
  name: 'recipe-card',
  data: () => ({
    skillStr: '',
    binderStr: '',
    rouletteStr: '',
    itemDlg: false,
  }),
  computed: {
    recipe() {
      return this.$store.state.recipe
    },
  },
  watch: {
    recipe: function() {
      this.updateRecipe()
    }
  },
  methods: {
    updateRecipe: function() {
      const skills = ("必要スキル" in this.recipe) ? this.recipe.必要スキル : {}
      this.skillStr = Object.keys(skills).map(k => k+'('+(skills[k]+0.0).toFixed(1)+')').join("<br />")

      this.binderStr = (this.recipe.収録バインダー.length == 0) ? "なし" : this.recipe.収録バインダー.map(b => b.バインダー名).join("<br />")

      if (!this.recipe.ギャンブル型 && !this.recipe.ペナルティ型) {
        this.rouletteStr = "通常"
      } else {
        this.rouletteStr = [this.recipe.ギャンブル型 ? "ギャンブル型" : "",
                            this.recipe.ペナルティ型 ? "ペナルティ型" : ""].filter(s => s != "").join("<br />")
      }
    },
    closeDialog: function() {
      this.$emit('update:recipeDlg', false)
    }
  },
  components: {
    ItemButton
  }
}
</script>

<style scoped>
  div.header {
    font-weight: bold;
  }

  /* v-card-row の高さ調整 */
  .card__row {
    min-height: 0px;
  }
</style>
