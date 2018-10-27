<template>
  <v-card id="recipe-card">
    <v-card-title>
      <v-progress-circular v-if="loadingRecipe" indeterminate color="primary">
      </v-progress-circular>
      {{recipe.レシピ名+'のレシピ情報'}}
      (<v-text-field class="pt-0 numField" min="1" maxlength="8" suffix="回分" type="Number" mask="#####" v-model="numberOfCombine"></v-text-field>)

      <v-spacer></v-spacer>
      <v-btn flat small icon class="small hidden-xs-only" @click.native="initRecipe()">
        <v-icon>close</v-icon>
      </v-btn>
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
        <v-flex md6 class="text-md-center" v-text="ing.個数*numberOfCombine">
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
        <v-flex md6 class="text-md-center" v-text="prod.個数*numberOfCombine">
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
import ItemButton from './ItemButton.vue'

export default {
  name: 'recipe-card',
  methods: {
    initRecipe: function() {
      this.$store.commit('initRecipe')
    },
  },
  computed: {
    recipe() {
      return this.$store.state.recipe
    },
    numberOfCombine: {
      get: function() {
        return this.$store.state.numberOfCombine
      },
      set: function(num) {
        if (num == '') {
          this.$store.dispatch('setNumberOfCombine', 1)
        } else {
          this.$store.dispatch('setNumberOfCombine', Number(num))
        }
      }
    },
    loadingRecipe() {
      return this.$store.state.loadingRecipe
    },
    skillStr() {
      const skills = ("必要スキル" in this.recipe) ? this.recipe.必要スキル : {}
      return Object.keys(skills).map(k => k+'('+(skills[k]+0.0).toFixed(1)+')').join("<br />")
    },
    binderStr() {
      return (this.recipe.収録バインダー.length == 0)
        ? "なし"
        : this.recipe.収録バインダー.map(b => b.バインダー名).join("<br />")
    },
    rouletteStr() {
      if (!this.recipe.ギャンブル型 && !this.recipe.ペナルティ型) {
        return "通常"
      } else {
        return [this.recipe.ギャンブル型 ? "ギャンブル型" : "",
                this.recipe.ペナルティ型 ? "ペナルティ型" : ""].filter(s => s != "").join("<br />")
      }
    },
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

  .numField {
    width: 90px;
    margin: 0 auto;
  }
</style>
