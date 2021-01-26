import { remote, ipcRenderer } from 'electron'
const version = '0.1'

function create (jsfilename, query, infoCallback) {
  return new Promise((resolve, reject) => {
    query = query || {}
    let winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`
    winURL += '#ChildProcess'
    console.log('childProcess url:', winURL)
    let win = new remote.BrowserWindow({
      title: 'childProcess',
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    })
    win.loadURL(winURL)
    const winId = win.id
    const parentWinId = remote.getCurrentWindow().id
    const successChannle = `success-${jsfilename}-${parentWinId}-${winId}`
    const errorChannle = `error-${jsfilename}-${parentWinId}-${winId}`
    const infoChannle = `info-${jsfilename}-${parentWinId}-${winId}`
    win.on('closed', () => {
      console.log(`win closed-${jsfilename}-${parentWinId}-${winId}`)
      ipcRenderer.removeAllListeners(successChannle)
      ipcRenderer.removeAllListeners(errorChannle)
      ipcRenderer.removeAllListeners(infoChannle)
      win = null
    })
    win.once('ready-to-show', () => {
      if (process.env.NODE_ENV === 'development') win.show()
      win.webContents.send('start', {
        jsfilename: jsfilename, // 要异步执行的js
        parentWinId: parentWinId, // 父窗口id，用来向父窗口发送事件
        successChannle: successChannle, // 异步成功事件
        errorChannle: errorChannle, // 异步错误事件
        infoChannle: infoChannle, // 异步回复信息事件
        data: query // 要传给异步js的参数
      })
    })
    ipcRenderer.once(successChannle, (event, args) => {
      console.log('channle', successChannle)
      console.log('event', event)
      console.log('args', args)
      resolve(args.data)
    })
    ipcRenderer.once(errorChannle, (event, args) => {
      console.log('channle', errorChannle)
      console.log('event', event)
      console.log('args', args)
      reject(args.data)
    })
    ipcRenderer.on(infoChannle, (event, args) => {
      console.log('channle', infoChannle)
      console.log('event', event)
      console.log('args', args)
      infoCallback && infoCallback(args)
    })
  })
}

export { version, create }
