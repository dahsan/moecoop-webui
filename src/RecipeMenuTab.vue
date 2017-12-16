<template>
<div id="menu-recipe-tab">
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step step="1" :complete="step > 1" :editable="step > 1">アイテムを選ぶ</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="step > 2" :editable="step > 2">レシピ・使用素材を選ぶ</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" :complete="step > 3">作成する</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <select-item-step :step.sync="step" @setTargets="t => setTargets(t)">
      </select-item-step>
    </v-stepper-content>

    <v-stepper-content step="2">
      <select-recipe-step :targets="targets" :step.sync="step" @setOwned="o => setOwned(o)">
      </select-recipe-step>
    </v-stepper-content>

    <v-stepper-content step="3">
      <recipe-result-step :targets="targets" :owned="owned" :step.sync="step">
      </recipe-result-step>
    </v-stepper-content>
  </v-stepper>
  </div>
</template>

<script>
import ItemButton from './ItemButton.vue'
import _ from 'lodash'
import { baseURL, getCall } from './rest'
import SelectItemStep from './RecipeMenu/SelectItemStep.vue'
import SelectRecipeStep from './RecipeMenu/SelectRecipeStep.vue'
import RecipeResultStep from './RecipeMenu/RecipeResultStep.vue'

export default {
  name: 'menu-recipe-tab',
  props: ['character'],
  data: () => ({
    step: 0,
    targets: [],
    owned: {},
  }),
  computed: {
    useCharacterInfo() {
      return this.$store.state.useCharacterInfo
    },
  },
  methods: {
    setStep: function(step) {
      this.step = step
    },
    setTargets: function(targets) {
      this.targets = targets
    },
    setOwned: function(owned) {
      this.owned = owned
    },
  },
  components: {
    ItemButton,
    SelectItemStep,
    SelectRecipeStep,
    RecipeResultStep,
  }
}
</script>

<style scoped>
</style>
