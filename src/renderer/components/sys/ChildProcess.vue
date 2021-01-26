<template>
  <div>
    <h2>electron-vue-process</h2>
  </div>
</template>

<script>
import { remote, ipcRenderer } from 'electron'
export default {
  name: 'ChildProcess',
  created () {
    let winId = remote.getCurrentWindow().id
    ipcRenderer.on('start', (event, args) => {
      console.log('on start')
      console.log('event', event)
      console.log('args', args)
      let parentWinId = args.parentWinId
      let parentWebContents = remote.BrowserWindow.fromId(parentWinId).webContents
      console.log('jsfilename', args.jsfilename)
      console.log('parentWinId', args.parentWinId)
      console.log('successChannle', args.successChannle)
      console.log('errorChannle', args.errorChannle)
      console.log('infoChannle', args.infoChannle)
      console.log('data', args.data)
      import(`@/assets/child-process/${args.jsfilename}`).then(module => {
        module.start(args.data, res => {
          // 向父窗口发送info事件
          parentWebContents.send(args.infoChannle, {
            message: `ChildProcess【${winId}】info`,
            data: res
          })
        }).then(res => {
          console.log('child-process finished')
          // 通知父窗口成功
          parentWebContents.send(args.successChannle, {
            message: `ChildProcess【${winId}】success`,
            data: res
          })
        }).catch(err => {
          console.error(err)
          // 通知父窗口错误
          parentWebContents.send(args.errorChannle, {
            message: `ChildProcess【${winId}】error`,
            data: err
          })
        }).finally(() => {
          remote.getCurrentWindow().close()
        })
      })
    })
  }
}
</script>