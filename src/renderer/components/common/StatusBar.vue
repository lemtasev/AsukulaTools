<template>
  <div class="status-bar drag-win">
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">
      <button class="status-bar-btn" @click="logEvents">Events</button>
      <button class="status-bar-btn" @click="toggleDevTools">devTools</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusBar',
  data () {
    return {}
  },
  watch: {},
  created () {
    console.log(`${this.$options.name} created`)
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  methods: {
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
    padding-left: 8px;
  }

  .center {
  }

  .right {
    height: 100%;
    display: flex;
    align-items: center;
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
