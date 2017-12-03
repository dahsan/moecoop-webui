<template>
<div id="menu-recipe-tab">
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step step="1" :complete="step > 1" :editable="step > 1">アイテムを選ぶ</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="step > 2" :editable="step > 2">作成数を選ぶ</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4" :complete="step > 4">作成する</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <select-item-step :targets.sync="targets"
                        @addTarget="it => addTarget(it)"
                        @removeTarget="it => removeTarget(it)">
      </select-item-step>
      <v-layout>
        <v-spacer></v-spacer>
        <v-btn small @click.native="step = 2" :disabled="targets.length == 0">作成数を選ぶ</v-btn>
      </v-layout>
    </v-stepper-content>

    <v-stepper-content step="2">
      <select-item-number-step :targets.sync="targets"
                               @setTargetNumber="it => setTargetNumber(it)">
      </select-item-number-step>
      <v-layout>
        <v-spacer></v-spacer>
        <v-btn small @click.native="step = 1">アイテムを選択し直す</v-btn>
        <v-btn small @click.native="step = 4"
               :disabled="targets.find((e, i, a) => e.個数 > 0) === undefined">
          アイテムを作成する
        </v-btn>
      </v-layout>
    </v-stepper-content>

    <v-stepper-content step="4">
      <recipe-result-step :targets.sync="targets">
      </recipe-result-step>
      <v-layout>
        <v-spacer></v-spacer>
        <v-btn small @click.native="step = 2">個数を決め直す</v-btn>
        <v-btn small @click.native="step = 1">最初からやり直す</v-btn>
      </v-layout>
    </v-stepper-content>
  </v-stepper>
  </div>
</template>

<script>
import ItemButton from './ItemButton.vue'
import _ from 'lodash'
import { baseURL, getCall } from './rest'
import SelectItemStep from './RecipeMenu/SelectItemStep.vue'
import SelectItemNumberStep from './RecipeMenu/SelectItemNumberStep.vue'
import RecipeResultStep from './RecipeMenu/RecipeResultStep.vue'

export default {
  name: 'menu-recipe-tab',
  props: ['character'],
  data: () => ({
    step: 0,
    query: '',
    fromIng: false,
    items: [],
    loadingItems: false,
    targets: [],
  }),
  computed: {
    useCharacterInfo() {
      return this.$store.state.useCharacterInfo
    },
  },
  watch: {
    query: function() {
      if (this.query != '') {
        this.lazyGetItems()
      }
    },
    fromIng: function() {
      if (this.query != '') {
        this.getItems()
      }
    },
  },
  methods: {
    lazyGetItems: _.debounce(
      function() {
        this.getItems()
      },
      500
    ),
    getItems: function() {
      this.loadingItems = true
      getCall(baseURL+'/items?migemo=true&only-products=true&from-ingredients='+this.fromIng+'&query='+this.query, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.items = JSON.parse(xhr.response)['アイテム一覧']
          this.loadingItems = false
        }
      })
    },
    addTarget: function(item) {
      if (!this.targets.find((elm, i, a) => elm.アイテム名 === item.アイテム名)) {
        item.個数 = 0
        this.targets.push(item)
      }
    },
    removeTarget: function(item) {
      const idx = this.targets.findIndex((elm, i, a) => elm.アイテム名 === item.アイテム名)
      if (idx !== -1) {
        this.targets.splice(idx, 1)
      }
    },
    setTargetNumber: function(item) {
      let idx = this.targets.findIndex((elm, i, a) => elm.アイテム名 === item.アイテム名)
      this.$set(this.targets, idx, item)
    },
  },
  components: {
    ItemButton,
    SelectItemStep,
    SelectItemNumberStep,
    RecipeResultStep,
  }
}
</script>

<style scoped>
</style>
