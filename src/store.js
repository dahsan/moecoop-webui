import Vue from 'vue'
import Vuex from 'vuex'

import { baseURL, restCall } from './rest'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    item: {
      アイテム名: '',
      特殊条件: [],
      ペットアイテム: { 種別: '不明' },
      info: '',
      備考: '',
    },
    recipe: {
      レシピ名: '',
      テクニック: ['わからん'],
      必要スキル: { 'わからん': 0 },
      収録バインダー: [{バインダー名: 'わからん'}],
      レシピ必須: false,
      材料: { 'わからん': 0 },
      生成物: { 'わからん': 0 },
      備考: 'よくわからん(´・ω・`)',
    },
  },
  mutations: {
    setItem(state, newItem) {
      state.item = newItem
    },
    setRecipe(state, newRecipe) {
      state.recipe = newRecipe
    },
  },
  actions: {
    setItem({ commit }, newItem) {
      restCall('GET', baseURL+newItem.詳細, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          commit('setItem', JSON.parse(xhr.response))
        } else if (xhr.status==404) {
          commit('setItem', {
            アイテム名: newItem.アイテム名,
            英名: "わからん(´・ω・`)",
            info: "",
            重さ: 0.0,
            NPC売却価格: 0,
            特殊条件: [],
            ペットアイテム: { 種別: '不明' },
            備考: "細かいことは\nわかりません(´・ω・`)",
          })
        }
      })
    },
    setRecipe({ commit }, newRecipe) {
      restCall('GET', baseURL+newRecipe.詳細, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          commit('setRecipe', JSON.parse(xhr.response))
        } else if (xhr.status==404) {
          commit('setRecipe', {
            レシピ名: this.recipe.レシピ名,
            テクニック: ['わからん'],
            必要スキル: { 'わからん': 0 },
            収録バインダー: [{バインダー名: 'わからん'}],
            レシピ必須: false,
            材料: { 'わからん': 0 },
            生成物: { 'わからん': 0 },
            備考: '細かいことは\nわかりません(´・ω・`)',
          })
        }
      })
    },
  }
})

