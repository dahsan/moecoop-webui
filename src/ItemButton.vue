<template>
  <div id="item-button">
    <v-btn light flat small class="small hidden-xs-only" @click.native="updateItem(item)">{{item.アイテム名}}</v-btn>
    <v-dialog v-model="dlg" fullscreen :overlay=false persistent class="hidden-sm-and-up">
      <v-btn light flat small class="small" slot="activator" @click.native="updateItem(item)">{{item.アイテム名}}</v-btn>
      <item-card :itemDlg.sync="dlg">
      </item-card>
    </v-dialog>
  </div>
</template>

<script>
import ItemCard from './ItemCard.vue'

export default {
  name: 'item-button',
  props: ['item'],
  data() {
    return {
      dlg: false
    }
  },
  methods: {
    updateItem: function(it) {
      this.$store.dispatch('setItem', it)
    }
  },
  components: {
    ItemCard
  }
}
</script>

<style scoped>
  .small {
    margin: 0px;
    padding: 0 0px;
  }
</style>
