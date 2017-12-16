import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { baseURL, getCall, postCall } from './rest'
import calcSkillFromURL from './skill'

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
    const dat = calcSkillFromURL(payload.url)
    newChar['skill'] = dat.skill
    Vue.set(state.characters, newChar.name, newChar)
  },
  deleteCharacter(state, char) {
    Vue.delete(state.characters, char)
  },
  setCharacterURL(state, payload) {
    const dat = calcSkillFromURL(payload.url)
    const newVal = { name: payload.char, url: payload.url, race: dat.race, skill: dat.skill }
    const idx = state.characters.findIndex((e, i, cs) => { return e.name == payload.char })
    Vue.set(state.characters, idx, newVal)
  },
  setPrice(state, payload) {
    Vue.set(state.prices, payload.item, payload.price)
  },
  deletePrice(state, item) {
    Vue.delete(state.prices, item)
  },
  gotoTab(state, tab) {
    state.tab = tab
  },
  useSimpleMode(state, val) {
    state.useSimpleMode = val
  },
  useDarkTheme(state, val) {
    state.useDarkTheme = val
    state.linkColor = val ? 'orange' : 'blue'
  },
  useCharacterInfo(state, val) {
    state.useCharacterInfo = val
  },
  setRecipePreference(state, payload) {
    Vue.delete(state.recipePreference, payload.item)
    Vue.set(state.recipePreference, payload.item, payload.recipe)
  },
  addLeafItem(state, it) {
    state.leafItems.push(it)
  },
  removeLeafItem(state, it) {
    state.leafItems = state.leafItems.filter((elm, i, a) => elm != it)
  },
  initItem(state) {
    state.item = {
      アイテム名: '',
      特殊条件: [],
      ペットアイテム: { 種別: '不明' },
      レシピ: [],
      info: '',
      備考: '',
    }
  },
  initRecipe(state) {
    state.recipe = {
      レシピ名: '',
      テクニック: ['わからん'],
      必要スキル: { 'わからん': 0 },
      収録バインダー: [{バインダー名: 'わからん'}],
      レシピ必須: false,
      材料: { 'わからん': 0 },
      生成物: [{'アイテム名': 'わからん'}],
      備考: 'よくわからん(´・ω・`)',
    }
  },
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
  setRecipePreference({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      commit('setRecipePreference', payload)
      resolve()
    })
  },
  addLeafItem({ commit }, item) {
    return new Promise((resolve, reject) => {
      commit('addLeafItem', item)
      resolve()
    })
  },
  removeLeafItem({ commit }, item) {
    return new Promise((resolve, reject) => {
      commit('removeLeafItem', item)
      resolve()
    })
  },
}

export default new Vuex.Store({
  state: {
    useDarkTheme: false,
    linkColor: 'blue',
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
      生成物: [{'アイテム名': 'わからん'}],
      備考: 'よくわからん(´・ω・`)',
    },
    loadingRecipe: false,
    characters: [
      { name: 'しらたま', url: '', skills: {} },
    ],
    prices: {
    },
    tab: null,
    useSimpleMode: false,
    useCharacterInfo: false,
    recipePreference: {
      '魚の餌': '魚の餌(ヘビの肉)',
      '砂糖': '砂糖(臼)',
      '塩': '塩(岩塩)',
      'パン粉': 'パン粉',
      'パン生地': 'パン生地',
      'パイ生地': 'パイ生地(ミニ ウォーター ボトル)',
      'ゼラチン': 'ゼラチン(オークの骨)',
      '切り身魚のチーズ焼き': '切り身魚のチーズ焼き',
      'お雑煮': 'お雑煮',
      '味噌汁': '味噌汁',
      'ざるそば': 'ざるそば',
      'ベーコン': 'ベーコン',
      'ショート ケーキ': 'ショート ケーキ',
      '揚げ玉': 'かき揚げ',
      '焼き鳥': '焼き鳥',
      'かけそば': 'かけそば',
      'そば湯': 'ざるそば',
      'モチ': 'モチ(ミニ ウォーター ボトル)',
      'パルプ': 'パルプ(木の板材)',
      '小さな紙': '小さな紙(調合)',
      '髪染め液': '髪染め液',
      '染色液': '染色液',
      '染色液(大)': '染色液(大)',
      'クロノスの涙': 'クロノスの涙',
      'クロノスの光': 'クロノスの光',
      '骨': '骨(タイガー ボーン)',
      'ボーン チップ': 'ボーン チップ(タイガー ボーン)',
      '鉄の棒': '鉄の棒(アイアンインゴット)',
      'カッパーインゴット': 'カッパーインゴット(鉱石)',
      'ブロンズインゴット': 'ブロンズインゴット(鉱石)',
      'アイアンインゴット': 'アイアンインゴット(鉱石)',
      'スチールインゴット': 'スチールインゴット(鉱石)',
      'ブラスインゴット': 'ブラスインゴット(鉱石)',
      'シルバーインゴット': 'シルバーインゴット(鉱石)',
      'ゴールドインゴット': 'ゴールドインゴット(鉱石)',
      'ミスリルインゴット': 'ミスリルインゴット(鉱石)',
      'オリハルコンインゴット': 'オリハルコンインゴット(鉱石)',
    },
    leafItems: [],
  },
  mutations: mutations,
  actions: actions,
  plugins: [createPersistedState()]
})
