<template>
  <div id="config-tab">
    <v-checkbox label="シンプルモード" v-model="useSimpleMode">
    </v-checkbox>
    アイテム情報のうち、性能とは関係ない英名および info の項目を非表示にします。

    <v-checkbox label="ダークモード" v-model="useDarkTheme">
    </v-checkbox>
    背景を黒っぽくします。

    <v-checkbox label="キャラクター情報を反映させる" disabled v-model="useCharacterInfo">
    </v-checkbox>
    所持キャラクターのスキル値やバインダーの登録情報を検索結果に反映させます。<br />

    <v-layout class="mt-4" v-if="false">
      <v-flex md5>
        <h6>登録キャラクター一覧</h6>
      </v-flex>
      <v-flex md2>
        <v-btn small @click.native.stop="createDialog = true" class="mt-0 ml-0">追加</v-btn>
        <v-dialog v-model="createDialog">
          <v-card>
            <v-card-title class="headline">キャラクターの追加</v-card-title>
            <v-card-text>
              <v-text-field label="キャラクター名">
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small @click.native="createDialog = false">追加する</v-btn>
              <v-btn small @click.native="createDialog = false">やっぱりやめる</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-expansion-panel v-if="false">
      <v-expansion-panel-content v-for="(char, i) in characters" :key="i">
        <div slot="header">
          {{char.name}}
          <v-btn small @click.native="gotoSkillPon(char.url)">スキるぽん</v-btn>
          <v-btn small @click.native.stop="deleteDialog = true">キャラクターの削除</v-btn>
          <v-dialog v-model="deleteDialog">
            <v-card>
              <v-card-title class="headline">確認</v-card-title>
              <v-card-text>本当に削除しますか？</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small @click.native="deleteDialog = false">はい</v-btn>
                <v-btn small @click.native="deleteDialog = false">やっぱりやめる</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-card>
          <v-card-text>
            <v-layout>
              <v-flex md2>
                <v-subheader class="mt-2">
                  スキル URL
                </v-subheader>
              </v-flex>
              <v-flex md7>
                <v-text-field v-model="char.url" @input="updateURL(char)">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
</div>
</template>

<script>

export default {
  name: 'config-tab',
  data: () => ({
    createDialog: false,
    deleteDialog: false,
    checked: false,
    charHeaders: [
      { text: '名前', value: 'name', align: 'center' },
      { text: 'スキルURL', value: 'url', align: 'center' },
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
    useDarkTheme: {
      get: function() {
        return this.$store.state.useDarkTheme
      },
      set: function(val) {
        this.$store.commit('useDarkTheme', val)
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
    updateURL: function(charInfo) {
      this.$store.commit('setCharacterURL', charInfo)
    },
  },
}
</script>

<style scoped>
</style>
