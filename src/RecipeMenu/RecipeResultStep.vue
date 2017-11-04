<template>
<div id="recipe-result-step">
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
            {{r.item.個数}}個
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout class="mt-5">
    <v-flex md12>
      <h6 class="text-md-center">
        この辺にとても素敵でわかりやすい UI
      </h6>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import ItemButton from '../ItemButton.vue'

export default {
  name: 'recipe-result-step',
  props: ['targets'],
  methods: {
  },
  components: {
    ItemButton
  }
}
</script>

<style scope>
</style>
