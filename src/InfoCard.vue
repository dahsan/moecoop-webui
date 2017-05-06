<template>
  <v-card id="info-card">
    <v-toolbar>
      <v-btn icon="icon" @click.native="closeDialog()" class="hidden-sm-and-up">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title v-text="recipe.レシピ名+'のレシピ情報'">
      </v-toolbar-title>
    </v-toolbar>

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
