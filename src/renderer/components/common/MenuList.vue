<template>
  <div class="menu-list">
    <div class="search-box">
      <el-input v-model="searchVal" clearable prefix-icon="el-icon-search" size="mini" @input="searchInput"></el-input>
    </div>
    <el-scrollbar :native="false" class="menus">
      <template v-for="(item, n) in menus">
        <div v-if="!item.hidden" :key="item.link" class="menu-item" :title="item.name" :class="{'active': tabbarList.length > 0 && tabbarList.filter(it => it.active)[0].link === item.link}" @click="clickMenu(n)">
          <img class="icon-image" :src="item.icon">
          <span>{{ item.name }}</span>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>

<script>
import { sysMenus } from '@/assets/js/default-value'
export default {
  name: 'MenuList',
  data () {
    return {
      searchVal: '',
      tabbarList: this.$store.getters['Tab/get'],
      menus: sysMenus.get()
    }
  },
  watch: {},
  created () {
    console.log(`${this.$options.name} created`)
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  methods: {
    searchInput (v) {
      this.menus.forEach(it => {
        if (it.name.indexOf(v) !== -1) {
          it.hidden = false
        } else {
          it.hidden = true
        }
      })
    },
    clickMenu (n) {
      // this.$store.dispatch('Tab/do', {type: 'open', data: this.menus[n]})
      this.$store.dispatchPromise('Tab/do', {type: 'open', data: this.menus[n]})
    }
  }
}
</script>

<style lang="less" scoped>
.menu-list {
  width: 200px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid @colorBorder;
  background-color: @MenuListBkgColor;

  .search-box {
    padding: 0 8px;
    width: calc(100% - 16px);
    height: 32px;
    display: flex;
    align-items: center;
  }

  .menus {
    flex: 1;
    width: 100%;
    //overflow-y: scroll;
    overflow: hidden;

    .menu-item {
      padding: 0 8px;
      width: calc(100% - 16px);
      height: 65px;
      display: flex;
      align-items: center;
      overflow: hidden;

      .icon-image {
        width: 40px;
        height: 40px;
      }

      span {
        padding: 0 8px;
        white-space: nowrap;
      }
    }

    .menu-item:hover {
      background-color: rgba(43, 43, 43, 0.1);
    }

    .menu-item.active {
      background-color: rgba(43, 43, 43, 0.2);
    }
  }
}
</style>
