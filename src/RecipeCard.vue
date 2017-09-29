<template>
  <v-card id="recipe-card">
    <v-card-title v-text="recipe.レシピ名+'のレシピ情報'">
    </v-card-title>

    <v-card-text>
      <v-layout>
        <v-flex md6 class="text-md-center caption">
          材料
        </v-flex>
        <v-flex md6 class="text-md-center caption">
          個数
        </v-flex>
      </v-layout>

      <v-divider />

      <v-layout v-for="ing in recipe.材料" :key="ing.アイテム名">
        <v-flex md6 class="text-md-center">
          <item-button :item="ing">
          </item-button>
        </v-flex>
        <v-flex md6 class="text-md-center" v-text="ing.個数">
        </v-flex>
      </v-layout>

      <v-divider />

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          生成物
        </v-flex>
        <v-flex md6 class="text-md-center caption">
          個数
        </v-flex>
      </v-layout>

      <v-divider />

      <v-layout v-for="prod in recipe.生成物" :key="prod.アイテム名">
        <v-flex md6 class="text-md-center">
          <item-button :item="prod">
          </item-button>
        </v-flex>
        <v-flex md6 class="text-md-center" v-text="prod.個数">
        </v-flex>
      </v-layout>

      <v-divider />

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          テクニック
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{recipe.テクニック.join(", ")}}
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          必要スキル
        </v-flex>
        <v-flex md6 class="text-md-center" v-html="skillStr">
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          収録バインダー
        </v-flex>
        <v-flex md6 class="text-md-center" v-html="binderStr">
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          レシピ必須
        </v-flex>
        <v-flex md6 class="text-md-center">
          {{recipe.レシピ必須 ? "はい" : "いいえ"}}
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md6 class="text-md-center caption">
          ルーレット
        </v-flex>
        <v-flex md6 class="text-md-center" v-text="rouletteStr">
        </v-flex>
      </v-layout>

      <v-layout v-if="recipe.備考 != ''">
        <v-flex md6 class="text-md-center caption">
          備考
        </v-flex>
        <v-flex md6 class="text-md-center" v-text="recipe.備考">
        </v-flex>
      </v-layout>

      <v-divider />
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
  .caption {
    font-weight: bold;
    font-family: sans-serif;
  }
</style>
