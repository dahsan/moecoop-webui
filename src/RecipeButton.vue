<template>
  <div id="recipe-button">
    <v-btn light flat class="hidden-xs-only" @click.native="updateRecipe(recipe)">{{recipe.レシピ名}}</v-btn>
    <v-dialog v-model="dlg" fullscreen :overlay=false persistent class="hidden-sm-and-up">
      <v-btn light flat slot="activator" @click.native="updateRecipe(recipe)">{{recipe.レシピ名}}</v-btn>
      <recipe-card :recipeDlg.sync="dlg">
      </recipe-card>
    </v-dialog>
  </div>
</template>

<script>
import RecipeCard from './RecipeCard.vue'

export default {
  name: 'recipe-button',
  props: ['recipe'],
  data() {
    return {
      dlg: false
    }
  },
  methods: {
    updateRecipe: function(r) {
      this.$store.dispatch('setRecipe', r)
    }
  },
  components: {
    RecipeCard
  }
}
</script>

<style scoped>
</style>
