<template>
  <div class="home">
    <aside class="drag-win" :class="{'show': userConfig['General.ShowAside']}">
      <aside-cmp></aside-cmp>
    </aside>
    <main>
      <title-bar></title-bar>
      <div class="content">
        <menu-list></menu-list>
        <div class="view">
          <auto-register v-for="item in tabbarList" :key="item.link" :item="item"></auto-register>
        </div>
      </div>
      <status-bar></status-bar>
    </main>
  </div>
</template>

<script>
import { sysSettings } from '@/assets/js/default-value'
import merge from 'merge'
import TitleBar from '@/components/common/TitleBar'
import StatusBar from '@/components/common/StatusBar'
import MenuList from '@/components/common/MenuList'
import AutoRegister from '@/components/common/AutoRegister'
import AsideCmp from './common/AsideCmp.vue'

export default {
  name: 'Home',
  components: { AutoRegister, MenuList, StatusBar, TitleBar, AsideCmp },
  data () {
    return {
      home: this,
      userConfig: this.$store.getters['Config/getUserConfig'],
      tabbarList: this.$store.getters['Tab/get']
    }
  },
  watch: {
  },
  created () {
    console.log(`${this.$options.name} created`)
    this.$store.dispatchPromise('Config/do', {type: 'updateAll', data: merge(sysSettings.getDefaultConfig(), this.userConfig)}).then(res => {
      console.log('已设置默认config')
    })
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import "../common.less";

.home {
  //background: radial-gradient(ellipse at top right, @themeColor 50%, @themeColor80 100%);
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;

  aside {
    width: 0;
    height: 100%;
    background-color: rgb(43, 43, 43);
    transition: width 0.3s;
    &.show{
      width: 60px;
    }
  }

  main {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .content {
      flex: 1;
      display: flex;
      overflow: hidden;

      .view {
        flex: 1;
        overflow: hidden;
        background-color: white;
        //overflow-y: scroll;
      }
    }
  }
}

</style>
