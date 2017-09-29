<template>
  <div id="recipe-button">
    <v-btn light flat small primary class="small hidden-xs-only" @click.native="updateRecipe(recipe)">{{recipe.レシピ名}}</v-btn>
    <v-dialog lazy v-model="dialog" fullscreen>
      <v-btn light flat small primary slot="activator"
             class="small hidden-sm-and-up"
             @click.native="updateRecipe(recipe)">
        {{recipe.レシピ名}}
      </v-btn>
      <v-card>
        <v-card-text>
          <router-view name="recipe"></router-view>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.native="dialog=false" class="black--text">
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'recipe-button',
  props: ['recipe'],
  data: () => ({
    dialog: false,
  }),
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
