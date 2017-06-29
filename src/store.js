import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { baseURL, restCall } from './rest'

Vue.use(Vuex)

export const mutations = {
  setItem(state, newItem) {
    state.item = newItem
  },
  setRecipe(state, newRecipe) {
    state.recipe = newRecipe
  },
  addCharacter(state, newChar) {
    state.characters[newChar.name] = newChar
  },
  deleteCharacter(state, char) {
    state.characters.remove(char)
  },
}

export const actions = {
  setItem({ commit }, newItem) {
    restCall('GET', baseURL+newItem.詳細, (xhr) => {
      if (xhr.readyState==4 && xhr.status==200) {
        commit('setItem', JSON.parse(xhr.response))
      } else if (xhr.status==404) {
        commit('setItem', {
          アイテム名: newItem.アイテム名,
          英名: "",
          info: "",
          重さ: 0.0,
          NPC売却価格: 0,
          特殊条件: [],
          ペットアイテム: { 種別: '不明' },
          レシピ: [],
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

export default new Vuex.Store({
  state: {
    item: {
      アイテム名: '',
      特殊条件: [],
      ペットアイテム: { 種別: '不明' },
      レシピ: [],
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
    characters: {
      しらたま: { name: 'しらたま' },
    },
  },
  mutations: mutations,
  actions: actions,
  plugins: [createPersistedState()]
})
