<template>
  <div id="item-button">
    <v-btn light flat small class="small" @click.native="updateItem(item)">{{item.アイテム名}}</v-btn>
  </div>
</template>

<script>
export default {
  name: 'item-button',
  props: ['item'],
  methods: {
    updateItem: function(it) {
      this.$store.dispatch('setItem', it)
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
