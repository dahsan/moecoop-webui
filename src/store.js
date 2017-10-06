import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { baseURL, getCall, postCall } from './rest'

Vue.use(Vuex)

export const mutations = {
  setItem(state, newItem) {
    state.item = newItem
  },
  setLoadingItem(state, s) {
    state.loadingItem = s
  },
  setRecipe(state, newRecipe) {
    state.recipe = newRecipe
  },
  setLoadingRecipe(state, s) {
    state.loadingRecipe = s
  },
  addCharacter(state, newChar) {
    Vue.set(state.characters, newChar.name, newChar)
  },
  deleteCharacter(state, char) {
    Vue.delete(state.characters, char)
  },
  setPrice(state, payload) {
    Vue.set(state.prices, payload.item, payload.price)
  },
  deletePrice(state, item) {
    Vue.delete(state.prices, item)
  }
}

export const actions = {
  setItem({ commit, state }, newItem) {
    return new Promise((resolve, reject) => {
      commit('setLoadingItem', true)
      postCall(baseURL+newItem.詳細, { "調達価格": state.prices }, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          commit('setItem', JSON.parse(xhr.response))
          commit('setLoadingItem', false)
          resolve()
        } else if (xhr.status==404) {
          commit('setItem', {
            アイテム名: newItem.アイテム名,
            英名: "",
            info: "",
            重さ: 0.0,
            NPC売却価格: 0,
            参考価格: 0,
            特殊条件: [],
            ペットアイテム: { 種別: '不明' },
            レシピ: [],
            備考: "細かいことは\nわかりません(´・ω・`)",
          })
          commit('setLoadingItem', false)
          resolve()
        }
      })
    })
  },
  setRecipe({ commit }, newRecipe) {
    return new Promise((resolve, reject) => {
      commit('setLoadingRecipe', true)
      getCall(baseURL+newRecipe.詳細, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          commit('setRecipe', JSON.parse(xhr.response))
          commit('setLoadingRecipe', false)
          resolve()
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
          commit('setLoadingRecipe', false)
          resolve()
        }
      })
    })
  },
  setPrice({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      commit('setPrice', payload)
      resolve()
    })
  },
  deletePrice({ commit }, item) {
    return new Promise((resolve, reject) => {
      commit('deletePrice', item)
      resolve()
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
    loadingItem: false,
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
    loadingRecipe: false,
    characters: {
      しらたま: { name: 'しらたま' },
    },
    prices: {
    },
  },
  mutations: mutations,
  actions: actions,
  plugins: [createPersistedState()]
})
