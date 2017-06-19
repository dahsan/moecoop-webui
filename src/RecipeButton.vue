<template>
  <div id="recipe-button">
    <v-btn light flat small class="small" @click.native="updateRecipe(recipe)">{{recipe.レシピ名}}</v-btn>
  </div>
</template>

<script>
export default {
  name: 'recipe-button',
  props: ['recipe'],
  methods: {
    updateRecipe: function(r) {
      this.$store.dispatch('setRecipe', r)
    }
  }
}
</script>

<style scoped>
  .small {
    margin: 0px;
    padding: 0 0px;
  }
</style>
