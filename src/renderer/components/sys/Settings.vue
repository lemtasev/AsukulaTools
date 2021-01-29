<template>
  <div class="settings-container"
       v-loading="loading">
    <div class="settings-left">
      <div v-for="(item, n) in settings" :key="item.title" @click="clickType(n)" class="settings-title"
           :class="{'active': item.active}">
        {{ item.text }}
      </div>
    </div>
    <div class="settings-right">
      <el-scrollbar ref="elScroll" class="settings-detail">

        <el-form :model="userConfig" label-position="top" size="mini">
          <div v-for="item in settings" :key="item.title" :ref="item.title" class="settings-block">
            <div class="settings-block-title">{{ item.text }}</div>
            <div v-for="it in item.settings" :key="it.name" class="settings-block-line">
              <p style="font-weight: bold;">{{ it.name }}<i class="el-icon-document-copy copy-config" title="复制配置" @click="copyConfig(`${item.title}.${it.name}`)"></i></p>

              <el-form-item v-if="it.type === 'checkbox'">
                <el-checkbox v-model="userConfig[`${item.title}.${it.name}`]">{{ it.text }}</el-checkbox>
              </el-form-item>

              <el-form-item v-else-if="it.type === 'input'" :label="it.text">
                <el-input v-model="userConfig[`${item.title}.${it.name}`]"></el-input>
              </el-form-item>

              <el-form-item v-else-if="it.type === 'textarea'" :label="it.text">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}"
                          v-model="userConfig[`${item.title}.${it.name}`]"></el-input>
              </el-form-item>

              <el-form-item v-else-if="it.type === 'select'" :label="it.text">
                <el-select v-model="userConfig[`${item.title}.${it.name}`]">
                  <el-option
                      v-for="op in it.options"
                      :key="op.value"
                      :label="op.text"
                      :value="op.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-else-if="it.type === 'choose-folder'" :label="it.text">
                <el-input v-model="userConfig[`${item.title}.${it.name}`]">
                  <el-button slot="append" icon="el-icon-folder" @click="chooseFolder(`${item.title}.${it.name}`)"></el-button>
                </el-input>
              </el-form-item>

              <el-form-item v-else :label="it.text">
                <span>错误的type</span>
              </el-form-item>

            </div>
          </div>
          <el-form-item class="button-box">
           <el-button icon="el-icon-warning-outline" @click="clearUserConfig">清空配置</el-button>
            <el-button icon="el-icon-printer" @click="printUserConfig">打印配置</el-button>
            <el-button @click="setDefault">恢复默认</el-button>
            <el-button type="success" icon="el-icon-check" @click="checkModify">应用更改</el-button>
          </el-form-item>
        </el-form>

      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { sysSettings } from '@/assets/js/default-value'

export default {
  name: 'Settings',
  data () {
    return {
      loading: false,
      settings: sysSettings.get(),
      userConfig: {}
    }
  },
  watch: {},
  created () {
    console.log(`${this.$options.name} created`)
    this.userConfig = JSON.parse(JSON.stringify(this.$store.getters['Config/getUserConfig']))
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  methods: {
    clickType (n) {
      console.log(n)
      this.settings.forEach((it, i) => {
        if (n === i) {
          it.active = true
        } else {
          it.active = false
        }
      })
      this.$refs['elScroll'].wrap.scrollTop = this.$refs[this.settings[n].title][0].offsetTop
    },
    copyConfig (key) {
      let cpv = `"${key}" = ${this.userConfig[key]}`
      console.log(cpv)
      this.$electron.clipboard.writeText(cpv)
      this.$message({
        showClose: true,
        message: '已复制',
        type: 'success' // success/warning/info/error
      })
    },
    chooseFolder (formKey) {
      this.$electron.remote.dialog.showOpenDialog({
        properties: [
          'openDirectory'
        ]
      }).then(result => {
        if (!result.canceled) {
          console.log(result.filePaths[0])
          this.userConfig[formKey] = result.filePaths[0]
        }
      })
    },
    setDefault () {
      this.userConfig = sysSettings.getDefaultConfig()
    },
    checkModify () {
      console.log('----------checkModify----------')
      this.printUserConfig()
      this.loading = true
      this.$store.dispatchPromise('Config/do', {type: 'updateAll', data: this.userConfig}).then(res => {
        console.log('更改成功！')
      }).catch(err => {
        console.log('更改失败：')
        console.error(err.stack || err)
      }).finally(() => {
        this.loading = false
      })
      console.log('----------checkModify----------')
    },
    printUserConfig () {
      console.log(this.userConfig)
    },
    clearUserConfig () {
      this.$electron.remote.dialog.showMessageBox(this.$electron.remote.getCurrentWindow(), {
        type: 'question', // none/info/error/question/warning
        message: '是否清空已储存的配置信息？',
        detail: '此操作不可逆，请谨慎。',
        buttons: ['取消', '确定']
      }).then(res => {
        console.log(res)
        if (res.response === 1) {
          this.$store.dispatchPromise('Config/do', {type: 'clearUserConfig'}).catch(err => console.error(err))
          this.userConfig = {}
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.settings-container {
  width: 100%;
  height: 100%;
  display: flex;

  .settings-left {
    width: 170px;
    height: 100%;
    border-right: 1px solid @colorBorder;
    background-color: rgba(0, 0, 0, .05);

    .settings-title {
      padding: 8px 32px;

      &.active {
        background-color: rgba(0, 0, 0, .2);
      }
    }
  }

  .settings-right {
    flex: 1;
    height: 100%;
    overflow: hidden;

    .settings-detail {
      width: 100%;
      height: 100%;

      .settings-block {
        padding: 16px;
        display: flex;
        flex-direction: column;

        .settings-block-title {
          padding: 8px 0;
          font-size: @fontSizeBig;
          font-weight: bold;
          border-bottom: 1px solid @colorBorder;
        }

        .settings-block-line {
          padding: 0 16px;
          .copy-config{
            margin: 0 8px;
            visibility: hidden;
            &:hover{
              color: @themeColor;
            }
          }
          &:hover{
            background-color: rgba(0,0,0,.05);
            .copy-config{
              visibility: visible;
            }
          }
        }
      }

      .button-box{
        z-index: 2;
        width: calc(100% - 32px);
        margin: 0!important;
        padding: 16px;
        position: sticky;
        bottom: 0;
        display: flex!important;
        justify-content: flex-end!important;
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}
</style>
