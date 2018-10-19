<template>
  <div id="recipe-button">
    <v-btn flat small :color="link" class="small hidden-xs-only" @click.native="updateRecipe(recipe)">{{recipe.レシピ名}}</v-btn>
    <v-btn flat small :color="link" class="small hidden-sm-and-up" @click.native="showRecipeDetailTab(recipe)">
      {{recipe.レシピ名}}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'recipe-button',
  props: {
    recipe: Object,
    both: {
      type: Boolean,
      default: false,
    },
    numberOfCombine: {
      type: Number,
      default: 1,
    }
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    classes() {
      return {
        'both': this.both,
      }
    },
    link() {
      return this.$store.state.linkColor
    },
  },
  methods: {
    updateRecipe: function(r) {
      this.$store.dispatch('setRecipe', { recipe: r, num: this.numberOfCombine }).then(() => {
        if (this.both) {
          this.$store.dispatch('setItem', this.$store.state.recipe.生成物[0])
        }
      })
    },
    showRecipeDetailTab: function(r) {
      this.updateRecipe(r)
      this.$store.commit('gotoTab', 'recipe-detail-tab')
    },
  }
}
</script>

<style scoped>
  .small {
    margin: 0px;
    padding: 0 0px;
  }
</style>
