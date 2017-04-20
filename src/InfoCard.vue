<template>
  <div id="info-card">
    <b-card :header="recipe.レシピ名 + 'のレシピ情報'">
      <b-tabs small>
        <b-tab title="レシピ" active>
          <recipe-card :recipe="recipe" class="justify-content-center">
          </recipe-card>
        </b-tab>
        <b-tab title="アイテム1" disabled></b-tab>
        <b-tab title="アイテム2" disabled></b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import _ from 'lodash'
import RecipeCard from './RecipeCard.vue'

export default {
  name: 'info-card',
  props: ['recipe'],
  components: {
    RecipeCard
  }
}
</script>

<style scoped>
</style>
