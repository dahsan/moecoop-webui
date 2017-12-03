<template>
<div id="menu-recipe-tab">
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step step="1" :complete="step > 1" :editable="step > 1">アイテムを選ぶ</v-stepper-step>
      <v-divider></v-divider>
      <!-- <v-stepper-step step="2" :complete="step > 2" :editable="step > 2">作成数を選ぶ</v-stepper-step> -->
      <!-- <v-divider></v-divider> -->
      <v-stepper-step step="4" :complete="step > 4">作成する</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <select-item-step :targets.sync="targets" :step.sync="step"
                        @setTargets="t => setTargets(t)" @setStep="s => setStep(s)">
      </select-item-step>
    </v-stepper-content>

    <!-- <v-stepper-content step="2"> -->
    <!--   <select-item-number-step :targets.sync="targets" -->
    <!--                            :step.sync="step" -->
    <!--                            @setTargetNumber="it => setTargetNumber(it)"> -->
    <!--   </select-item-number-step> -->
    <!-- </v-stepper-content> -->

    <v-stepper-content step="4">
      <recipe-result-step :targets.sync="targets" :step.sync="step"
                          @setStep="s => setStep(s)">
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
import RecipeResultStep from './RecipeMenu/RecipeResultStep.vue'

export default {
  name: 'menu-recipe-tab',
  props: ['character'],
  data: () => ({
    step: 0,
    targets: [],
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
  },
  components: {
    ItemButton,
    SelectItemStep,
    RecipeResultStep,
  }
}
</script>

<style scoped>
</style>
