<template>
  <div id="info-card">
    <v-card class="elevation-1">
      <v-card-row class="blue darken-1">
        <v-card-title class="white--text">
          {{recipe.レシピ名}}のレシピ情報
        </v-card-title>
      </v-card-row>

      <v-card-text>
        <v-card-row>
          <recipe-card :recipe="recipe">
          </recipe-card>
        </v-card-row>
      </v-card-text>

      <!-- <b-tabs small> -->
      <!--   <b-tab title="レシピ" active> -->
      <!--     <recipe-card :recipe="recipe" class="justify-content-center"> -->
      <!--     </recipe-card> -->
      <!--   </b-tab> -->
      <!--   <b-tab title="アイテム1" v-if="recipe.追加情報.生成物.length >= 1"> -->
      <!--     <item-card :item="recipe.追加情報.生成物[0]" class="justify-content-center"> -->
      <!--     </item-card> -->
      <!--   </b-tab> -->
      <!--   <b-tab title="アイテム1" v-else disabled> -->
      <!--   </b-tab> -->
      <!--   <b-tab title="アイテム2" v-if="recipe.追加情報.生成物.length >= 2"> -->
      <!--     <item-card :item="recipe.追加情報.生成物[1]" class="justify-content-center"> -->
      <!--     </item-card> -->
      <!--   </b-tab> -->
      <!--   <b-tab title="アイテム2" v-else> -->
      <!--   </b-tab> -->
      <!--   <\!-- <b-tab :title="'アイテム'+(idx+1)" v-for="(it, idx) in recipe.追加情報.生成物" :key="idx"> -\-> -->
      <!--   <\!--   <item-card :item="it" class="justify-content-center"> -\-> -->
      <!--   <\!--   </item-card> -\-> -->
      <!--   <\!-- </b-tab> -\-> -->
      <!-- </b-tabs> -->
    </v-card>
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
</style>
