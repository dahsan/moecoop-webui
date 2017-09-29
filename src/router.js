import Vue from 'vue'
import VueRouter from 'vue-router'

import ItemCard from './ItemCard.vue'
import RecipeCard from './RecipeCard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    components: {
      item: ItemCard,
      recipe: RecipeCard,
    }
  }
]

export default new VueRouter({
  routes
})
