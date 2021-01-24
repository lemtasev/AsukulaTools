<template>
  <div class="title-bar drag-win">
    <div class="left drag-win">
      <div class="title-info drag-win" :style="{width: titleInfoWidth + 'px'}">{{
          this.$electron.remote.app.getName()
        }}
      </div>
      <div class="tabbar-box" :style="{width: 'calc(100% - ' + titleInfoWidth + 'px)'}">
        <ul class="drag-win">
          <li v-for="(item, n) in tabbarList" :key="item.link" :class="{'active': item.active === true}"
              :style="{width: 100 / ((tabbarList.length || 1) + (addNullTab ? 1 : 0)) + '%'}"
              @click="activeTab(n)"
              :title="item.name || 'error name'">
            <div class="tabbar-item">
              <div class="tabbar-item-left">
                {{ item.name }}
              </div>
              <div class="tabbar-item-right">
                <i class="close-btn el-icon-close" @click.stop="closeTab(n)"></i>
              </div>
            </div>
            <i class="corner-left"></i>
            <i class="corner-right"></i>
          </li>
          <li @click="pushNullTab" title="add empty tab" v-if="addNullTab">
            <div class="tabbar-item">
              <div class="tabbar-item-left">
              </div>
              <span>+</span>
              <div class="tabbar-item-right">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--    <div class="center">center</div>-->
    <div class="right drag-win">
      <button class="title-bar-btn" title="最小化" @click="minimize"><i class="iconfont icon-minimize"></i></button>
      <button v-if="!isMaximized" class="title-bar-btn" title="最大化" @click="maximize"><i
          class="iconfont icon-maximize"></i></button>
      <button v-else class="title-bar-btn" title="向下还原" @click="maximize"><i class="iconfont icon-maximize2"></i>
      </button>
      <button class="title-bar-btn close" title="关闭" @click="close"><i class="iconfont icon-close"></i></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBar',
  data () {
    return {
      titleInfoWidth: 200,
      isMaximized: false,
      tabbarList: this.$store.getters['Tab/get'],
      addNullTab: false // 是否显示增加空白面板按钮
    }
  },
  watch: {},
  created () {
    console.log(`${this.$options.name} created`)
    let win = this.$electron.remote.getCurrentWindow()
    win.on('maximize', () => {
      this.isMaximized = true
    })
    win.on('unmaximize', () => {
      this.isMaximized = false
    })
    if (win.isMaximized()) {
      this.isMaximized = true
    } else {
      this.isMaximized = false
    }
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  methods: {
    pushNullTab () {
      // this.$store.dispatch('Tab/do', {type: 'pushNullTab'})
      this.$store.dispatchPromise('Tab/do', {type: 'pushNullTab'})
    },
    closeTab (n) {
      // this.$store.dispatch('Tab/do', {type: 'closeTab', data: n})
      this.$store.dispatchPromise('Tab/do', {type: 'closeTab', data: n})
    },
    activeTab (n) {
      // this.$store.dispatch('Tab/do', {type: 'activeTab', data: n})
      this.$store.dispatchPromise('Tab/do', {type: 'activeTab', data: n})
    },
    minimize () {
      this.$electron.remote.getCurrentWindow().minimize()
    },
    maximize () {
      let win = this.$electron.remote.getCurrentWindow()
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    },
    close () {
      console.log('win will close')
      // this.$electron.remote.getCurrentWindow().close()
      this.$electron.remote.app.exit()
    }
  }
}
</script>

<style lang="less" scoped>
.title-bar {
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    padding-left: 8px;
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
    overflow: hidden;

    .title-info {
      //width: 200px;
    }

    .tabbar-box {
      height: 100%;

      ul {
        width: 100%;
        height: 100%;
        display: flex;

        @tabbar-normal-color: rgba(203, 204, 205, 1);
        @tabbar-hover-color: rgba(223, 224, 225, 1);
        @tabbar-active-color: rgba(255, 255, 255, 1);
        //@tabbar-normal-color: red;
        //@tabbar-hover-color: blue;
        //@tabbar-active-color: green;
        li {
          height: calc(100% - 2px);
          margin-top: 2px;
          background-color: @tabbar-normal-color;
          border-radius: 8px 8px 0 0;
          max-width: 200px;
          position: relative;
          transition: width .3s;
          border-left: 1px solid gray;

          .tabbar-item {
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .tabbar-item-left {
              margin-left: 8px;
              overflow: hidden;
              white-space: nowrap;
            }

            .tabbar-item-right {
              margin-right: 8px;
              height: 100%;
              display: flex;
              align-items: center;

              .close-btn {
                padding: 1px;
                border-radius: 50%;
                font-weight: bold;
                font-size: 13px;

                &:hover {
                  background-color: rgb(183, 184, 185);
                }
              }
            }
          }

          &:hover {
            border-left: 1px solid transparent;
            background-color: @tabbar-hover-color;
            z-index: 98;

            .corner-left {
              background: radial-gradient(circle farthest-side at top left, rgba(0, 0, 0, 0) 100%, @tabbar-hover-color);
              z-index: 98;
            }

            .corner-right {
              background: radial-gradient(circle farthest-side at top right, rgba(0, 0, 0, 0) 100%, @tabbar-hover-color);
              z-index: 98;
            }
          }

          &.active {
            border-left: 1px solid transparent;
            //background-color: rgba(238, 238, 238);
            background-color: @tabbar-active-color;
            z-index: 99;

            .corner-left {
              background: radial-gradient(circle farthest-side at top left, rgba(0, 0, 0, 0) 100%, @tabbar-active-color);
              z-index: 99;
            }

            .corner-right {
              background: radial-gradient(circle farthest-side at top right, rgba(0, 0, 0, 0) 100%, @tabbar-active-color);
              z-index: 99;
            }
          }

          .corner-left, .corner-right {
            width: 10px;
            height: 10px;
            position: absolute;
            bottom: 0;
            //transition: all 3s;
          }

          .corner-left {
            background: radial-gradient(circle farthest-side at top left, rgba(0, 0, 0, 0) 100%, @tabbar-normal-color);
            left: -10px;
          }

          .corner-right {
            background: radial-gradient(circle farthest-side at top right, rgba(0, 0, 0, 0) 100%, @tabbar-normal-color);
            right: -10px;
          }
        }
      }
    }
  }

  .center {
  }

  .right {
    padding-left: 32px;
    height: 100%;
    display: flex;
    align-items: center;

    .title-bar-btn {
      width: 36px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: none;
      outline: none;

      i {
        font-size: 10px;
        color: rgb(123, 123, 123);
      }
    }

    .title-bar-btn:hover {
      background-color: rgba(211, 211, 211, 0.6);

      i {
        color: rgb(77, 77, 77);
      }
    }

    .title-bar-btn.close:hover {
      background-color: rgb(255, 77, 77);

      i {
        color: white;
      }
    }
  }
}
</style>
