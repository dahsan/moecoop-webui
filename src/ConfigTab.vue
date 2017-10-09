<template>
  <div id="config-tab">
    <v-checkbox label="シンプルモード" v-model="useSimpleMode">
    </v-checkbox>
    アイテム情報のうち、性能とは関係ない英名および info の項目を非表示にします。

    <v-checkbox label="キャラクター情報を反映させる" disabled v-model="useCharacterInfo">
    </v-checkbox>
    所持キャラクターのスキル値やバインダーの登録情報を検索結果に反映させます。
  </div>
</template>

<script>

export default {
  name: 'config-tab',
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
  },
}
</script>

<style scoped>
</style>
