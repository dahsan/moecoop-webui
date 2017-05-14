<template>
  <v-card id="info-card">
    <v-toolbar>
      <v-toolbar-title v-text="recipe.レシピ名+'のレシピ情報'">
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-card-row>
        <recipe-card :recipe="recipe">
        </recipe-card>
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
import RecipeCard from './RecipeCard.vue'
import ItemCard from './ItemCard.vue'

export default {
  name: 'info-card',
  props: ['recipe'],
  methods: {
    closeDialog: function() {
      this.$emit('update:dlg', false)
    }
  },
  components: {
    RecipeCard,
    ItemCard
  }
}
</script>

<style scoped>
</style>
