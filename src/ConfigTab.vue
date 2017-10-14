<template>
  <div id="config-tab">
    <v-checkbox label="シンプルモード" v-model="useSimpleMode">
    </v-checkbox>
    アイテム情報のうち、性能とは関係ない英名および info の項目を非表示にします。

    <v-checkbox label="キャラクター情報を反映させる" disabled v-model="useCharacterInfo">
    </v-checkbox>
    所持キャラクターのスキル値やバインダーの登録情報を検索結果に反映させます。

    <v-data-table :headers="charHeaders" :items="characters" v-if="false">
      <template slot="items" slot-scope="props">
        <td v-text="props.item.name" class="text-md-center"></td>
        <td class="text-md-center">
          <v-text-field v-model="props.item.url">
          </v-text-field>
        </td>
        <td class="text-md-center">
          <v-btn small @click.native="gotoSkillPon(props.item.url)">スキるぽん</v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>

export default {
  name: 'config-tab',
  data: () => ({
    charHeaders: [
      { text: '名前', value: 'name', align: 'center' },
      { text: 'キャラクターURL', value: 'url', align: 'center' },
      { text: 'URL編集', align: 'center' },
    ],
  }),
  computed: {
    useCharacterInfo: {
      get: function() {
        return this.$store.state.useCharacterInfo
      },
      set: function(val) {
        this.$store.commit('useCharacterInfo', val)
      }
    },
    useSimpleMode: {
      get: function() {
        return this.$store.state.useSimpleMode
      },
      set: function(val) {
        this.$store.commit('useSimpleMode', val)
      }
    },
    characters() {
      return this.$store.state.characters
    },
  },
  methods: {
    gotoSkillPon: function(url) {
      const skillPonURL = 'https://www.ponz-web.com/skill/'
      if (url == '' || !url.startsWith(skillPonURL)) {
        url = skillPonURL
      }
      window.open(url)
    },
  },
}
</script>

<style scoped>
</style>
