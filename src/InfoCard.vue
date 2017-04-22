<template>
  <div id="info-card">
    <b-card :header="recipe.レシピ名 + 'のレシピ情報'">
      <b-tabs small>
        <b-tab title="レシピ" active>
          <recipe-card :recipe="recipe" class="justify-content-center">
          </recipe-card>
        </b-tab>
        <b-tab :title="'アイテム'+(idx+1)" v-for="(it, idx) in recipe.追加情報.生成物" :key="idx" active>
          <item-card :item="it" class="justify-content-center">
          </item-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import _ from 'lodash'
import RecipeCard from './RecipeCard.vue'
import ItemCard from './ItemCard.vue'

export default {
  name: 'info-card',
  props: ['recipe'],
  components: {
    RecipeCard,
    ItemCard
  }
}
</script>

<style scoped>
#info-card {
  max-width: 320px;
}
</style>
