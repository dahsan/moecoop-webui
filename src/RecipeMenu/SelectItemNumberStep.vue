<template>
<div id="select-item-number-step">
  <v-layout class="mt-4">
    <v-flex md12>
      <h6>作成候補</h6>
      <v-data-table no-data-text="作成候補はありません" :items="targets"
                    :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <th class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
          </th>
          <td>
            <v-text-field min="0" maxlength="8" suffix="個" type="number"
                          mask="###########" v-model="r.item.個数" @input="setTargetNumber(r.item)">
            </v-text-field>
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import ItemButton from '../ItemButton.vue'

export default {
  name: 'select-item-number-step',
  props: ['targets'],
  methods: {
    setTargetNumber: function(item) {
      item.個数 = Number(item.個数)
      this.$emit('setTargetNumber', item)
    },
  },
  components: {
    ItemButton
  }
}
</script>

<style scope>
</style>
