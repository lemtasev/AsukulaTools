const version = '0.1'

/**
 * 阻塞当前线程
 * @param {*} time 毫秒
 */
function sleep (time) {
  var startTime = new Date().getTime()
  while (new Date().getTime() < startTime + parseInt(time, 10)) {}
}

/**
 * 格式化文件大小
 * @param filesize 文件的大小,传入的是一个bytes为单位的参数
 * @returns {string}
 */
function formatSize (filesize) {
  if (!filesize) {
    return '0Bytes'
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index = 0
  const s = parseFloat(filesize)
  index = Math.floor(Math.log(s) / Math.log(1024))
  let size = s / Math.pow(1024, index)
  size = size.toFixed(2)// 保留的小数位数
  return size + unitArr[index]
}

/**
 * 省略文本中间部分
 * @param {*} text 文本
 * @param {*} opts 参数最大显示长度、省略符号
 */
function centralEllipsis (text, opts) {
  let settings = {
    maxLength: 14,
    ellipsis: '……'
  }
  if (opts && opts.maxLength) settings.maxLength = opts.maxLength
  if (settings.maxLength >= text.length) {
    return text
  }
  let prefixLength = Math.ceil(settings.maxLength / 2)
  let suffixLength = settings.maxLength - prefixLength
  let prefix, suffix
  prefix = text.substr(0, prefixLength)
  suffix = settings.maxLength < 2 ? '' : text.substr(-suffixLength)
  return prefix + settings.ellipsis + suffix
}

export { version, formatSize, centralEllipsis, sleep }
