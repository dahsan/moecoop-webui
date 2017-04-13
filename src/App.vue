<template>
<div id="app">
  <b-navbar toggleable type="inverse" variant="success">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>

    <b-link class="navbar-brand" to="#">
      <span>生協の知恵袋 ウェブ版</span>
    </b-link>

    <b-collapse is-nav id="nav_collapse">

      <b-nav is-nav-bar>
        <b-nav-item>Support</b-nav-item>
        <b-nav-item>ドキュメント</b-nav-item>
        <b-nav-item>コンタクト</b-nav-item>
      </b-nav>

      <b-nav is-nav-bar class="ml-auto">
          <!-- Using text slot -->
          <template slot="text">
            <span style="font-weight: bold;">ユーザー</span>
          </template>

          <b-dropdown-item to="#">Profile</b-dropdown-item>
          <b-dropdown-item to="#">Signout</b-dropdown-item>
        </b-nav-item-dropdown>

      </b-nav>
    </b-collapse>
  </b-navbar>
</div>

</template>
    <!-- <img src="./assets/moecoop.svg" width=200 > -->

<script>

export default {
  name: 'app',
  data() {
    return {
    }
  },
}
</script>

<style>
#app {
  padding: 20px;
  height: 300px;
}
</style>
