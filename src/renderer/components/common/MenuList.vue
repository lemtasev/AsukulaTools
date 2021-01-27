<template>
  <div class="menu-list">
    <div class="search-box">
      <el-input v-model="searchVal" clearable prefix-icon="el-icon-search" size="mini" @input="searchInput"></el-input>
    </div>
    <el-scrollbar :native="false" class="menus">
      <div v-if="!item.hidden" class="menu-item" v-for="(item, n) in menus" :key="item.link" :title="item.name"
           :class="{'active': tabbarList.length > 0 && tabbarList.filter(it => it.active)[0].link === item.link}" @click="clickMenu(n)">
        <img class="icon-image" :src="item.icon">
        <span>{{ item.name }}</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'MenuList',
  data () {
    return {
      searchVal: '',
      tabbarList: this.$store.getters['Tab/get'],
      menus: [
        {
          name: '进程数据',
          icon: '/src/renderer/assets/icons/aichong02.png',
          link: '/sys/AppMetrics'
        },
        {
          name: '设置',
          icon: '/src/renderer/assets/icons/aichong01.png',
          link: '/sys/Settings'
        },
        {
          name: 'Excel to JSON',
          icon: '/src/renderer/assets/icons/aichong07.png',
          link: '/excel/ExcelToJson'
        },
        {
          name: '图片转PDF',
          icon: '/src/renderer/assets/icons/aichong03.png',
          link: '/pdf/PicToPdf'
        },
        {
          name: '404页面',
          icon: '/src/renderer/assets/icons/aichong09.png',
          link: '/common/Cmp404'
        },
        {
          name: 'StatusBar',
          icon: '/src/renderer/assets/icons/aichong09.png',
          link: '/common/StatusBar'
        },
        {
          name: 'APP HOME',
          icon: '/src/renderer/assets/icons/aichong09.png',
          link: '/Home'
        },
        {
          name: '菜单页面',
          icon: '/src/renderer/assets/icons/aichong09.png',
          link: '/common/MenuList'
        },
        {
          name: 'TitleBar',
          icon: '/src/renderer/assets/icons/aichong09.png',
          link: '/common/TitleBar'
        }
      ]
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
