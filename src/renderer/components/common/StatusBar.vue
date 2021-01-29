<template>
  <div class="status-bar drag-win">
    <div class="left">
      <button class="status-bar-btn left-item" @click="hideAside" 
      :title="this.userConfig['General.ShowAside'] ? '隐藏边栏' : '显示边栏'">
        <i class="el-icon-arrow-right rotate-anim" :class="{'active': this.userConfig['General.ShowAside']}"></i>
      </button>
    </div>
    <div class="right">
      <el-popover style="height: 100%" placement="top">
        <button slot="reference" class="status-bar-btn right-item">click 激活</button>
        <div>
          123
        </div>
      </el-popover>
      <button class="status-bar-btn right-item" @click="clickEnv" title="打印环境参数">Env</button>
      <button class="status-bar-btn right-item" @click="logEvents" title="打印当前监听事件列表">Events</button>
      <button class="status-bar-btn right-item" @click="toggleDevTools" title="打开、关闭开发工具">devTools</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusBar',
  data () {
    return {
      userConfig: this.$store.getters['Config/getUserConfig']
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
    hideAside () {
      if (this.userConfig['General.ShowAside']) {
        this.$store.dispatchPromise('Config/do', {
          type: 'update',
          data: {
            key: 'General.ShowAside',
            value: false
          }
        })
      } else {
        this.$store.dispatchPromise('Config/do', {
          type: 'update',
          data: {
            key: 'General.ShowAside',
            value: true
          }
        })
      }
    },
    clickEnv () {
      console.log(process.versions)
    },
    logEvents () {
      console.log(this.$electron.ipcRenderer._events)
    },
    toggleDevTools () {
      //  https://www.electronjs.org/docs/api/web-contents
      this.$electron.remote.getCurrentWebContents().toggleDevTools()
    }
  }
}
</script>

<style lang="less" scoped>
.status-bar {
  width: 100%;
  height: 23px;
  //background-color: #ffffff;
  background-color: rgb(0,100,180);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    height: 100%;
    display: flex;
    align-items: center;
    .left-item {
      margin-left: 8px;
    }
  }

  .right {
    height: 100%;
    display: flex;
    align-items: center;
    .right-item {
      margin-right: 8px;
    }
  }

  .status-bar-btn {
    border: 0;
    height: 100%;
    background: none;
    outline: none;
    color: white;
  }

  .status-bar-btn:hover {
    background-color: rgba(177, 177, 177, 0.4);
  }
}
</style>
