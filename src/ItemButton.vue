<template>
  <div id="item-button">
    <v-btn light flat small primary class="small hidden-xs-only" @click.native="updateItem(item)">{{item.アイテム名}}</v-btn>
    <v-dialog v-model="dialog" fullscreen>
      <v-btn light flat small primary slot="activator"
             class="small hidden-sm-and-up"
             @click.native="updateItem(item)">
        {{item.アイテム名}}
      </v-btn>
      <v-card>
        <v-card-text>
          <router-view name="item"></router-view>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.native="dialog=false">
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'item-button',
  props: {
    item: Object,
    both: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    classes() {
      return {
        'both': this.both,
      }
    }
  },
  methods: {
    updateItem: function(it) {
      this.$store.dispatch('setItem', it).then(() => {
        const rs = this.$store.state.item.レシピ
        if (this.both && rs.length > 0) {
          this.$store.dispatch('setRecipe', rs[0])
        }
      })
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
