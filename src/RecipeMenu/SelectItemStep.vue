<template>
<div id="select-item-step">
  <v-layout>
    <v-flex md4>
      <v-text-field class="mb-0" :label="fromIng ? '素材名' : '作成アイテム'" v-model="query"></v-text-field>
    </v-flex>
    <v-flex md8>
      <div>
        <p class="text-xs-left mt-2 mb-0" v-if="loadingItems">
          を検索
          <v-progress-circular indeterminate color="primary">
          </v-progress-circular>
        </p>
        <p class="text-xs-left mt-4 mb-0" v-else>
          を検索
        </p>
      </div>
    </v-flex>
  </v-layout>

  <v-layout>
    <v-flex md12>
      <v-checkbox class="mt-0" label="材料から検索" v-model="fromIng">
      </v-checkbox>
    </v-flex>
  </v-layout>

  <v-layout>
    <v-flex md12>
      検索結果
      <v-data-table no-data-text="該当アイテムがありません" :items="items"
                    :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                    rows-per-page-text="アイテム表示数"
                    hide-headers>
        <template slot="items" slot-scope="r">
          <td>
            <v-btn icon small @click.native="addCandidate(r.item)"
                   :disabled="!candidateNumExists(r.item)">
              <v-icon>add</v-icon>
            </v-btn>
          </td>
          <td class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
            <v-text-field min="0" maxlength="6" suffix="個" type="number"
                          mask="######" v-model="nums[r.item.アイテム名]"
                          class="hidden-sm-and-up pt-0 numField">
            </v-text-field>
          </td>
          <td class="hidden-xs-only">
            <v-text-field min="0" maxlength="8" suffix="個" type="number" class="pt-0 numField"
                          mask="######" v-model="nums[r.item.アイテム名]">
            </v-text-field>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>

  <v-layout class="mt-1">
    <v-flex md12>
      作成候補
      <v-data-table no-data-text="作成候補はありません" :items="candidates"
                    :headers="[{ text: 'アイテム名', value: 'アイテム名'}]"
                    rows-per-page-text="アイテム表示数"
                    hide-headers
                    hide-actions>
        <template slot="items" slot-scope="r">
          <td>
            <v-btn icon small @click.native="removeCandidate(r.item)">
              <v-icon>clear</v-icon>
            </v-btn>
          </td>
          <td class="text-md-center">
            <item-button both :item="r.item">
            </item-button>
          </td>
          <td class="text-md-center">
            {{nums[r.item.アイテム名]}} 個
          </td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>

  <v-layout>
    <v-spacer></v-spacer>
    <v-btn small @click.native="setStep(2)"
           :disabled="validCandidates.length == 0">
      レシピ・使用素材を選ぶ
    </v-btn>
    <v-btn color="primary" @click.native="setStep(3)"
           :disabled="validCandidates.length == 0">
      作成する
    </v-btn>
  </v-layout>
</div>
</template>

<script>
import ItemButton from '../ItemButton.vue'
import _ from 'lodash'
import { baseURL, getCall } from '../rest'

export default {
  name: 'select-item-step',
  props: ['step'],
  data: () => ({
    query: '',
    fromIng: false,
    items: [],
    loadingItems: false,
    candidates: [],
    nums: {},
  }),
  computed: {
    validCandidates() {
      return this.candidates.filter((elm, i, a) => this.candidateNumExists(elm))
        .map((elm, i, a) => {
          elm.個数 = Number(this.nums[elm.アイテム名])
          return elm
        })
    },
  },
  watch: {
    query: function() {
      if (this.query != '') {
        this.lazyGetItems()
      }
    },
    fromIng: function() {
      if (this.query != '') {
        this.getItems()
      }
    },
  },
  methods: {
    lazyGetItems: _.debounce(
      function() {
        this.getItems()
      },
      500
    ),
    getItems: function() {
      this.loadingItems = true
      getCall(baseURL+'/items?migemo=true&only-products=true&from-ingredients='+this.fromIng+'&query='+this.query, (xhr) => {
        if (xhr.readyState==4 && xhr.status==200) {
          this.items = JSON.parse(xhr.response)['アイテム一覧']
          this.loadingItems = false
        }
      })
    },
    addCandidate: function(item) {
      if (!this.candidates.find((elm, i, a) => elm.アイテム名 === item.アイテム名)) {
        this.candidates.push(item)
      }
    },
    removeCandidate: function(item) {
      const idx = this.candidates.findIndex((elm, i, a) => elm.アイテム名 === item.アイテム名)
      if (idx !== -1) {
        this.candidates.splice(idx, 1)
      }
    },
    candidateNumExists: function(item) {
      return (item.アイテム名 in this.nums) && (this.nums[item.アイテム名] > 0)
    },
    setStep: function(n) {
      this.$emit('setTargets', this.validCandidates)
      this.$emit('update:step', n)
    },
  },
  components: {
    ItemButton
  }
}
</script>

<style scope>
  .numField {
    width: 90px;
    margin: 0 auto;
  }
</style>
