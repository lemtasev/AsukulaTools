import { workerData, parentPort } from 'worker_threads'
import {nativeImage} from 'electron'
import jsPDF from 'jspdf'
import _path from 'path'
import fs from 'fs'

let options = {
  orientation: workerData.orientation,
  compress: true
}
if (workerData.pageSizeType === '原图') {
  // 原图，以图片默认长宽设置页面大小，单位px
  if (!workerData.fileList[0].nativeImage) workerData.fileList[0].nativeImage = nativeImage.createFromPath(workerData.fileList[0].path)
  let {height, width} = workerData.fileList[0].nativeImage.getSize()
  options.unit = 'px'
  options.format = [width, height]
  options.orientation = width < height ? 'p' : 'l'
} else if (workerData.pageSizeType === '自定义') {
  // 自定义页面大小，单位可选，图片自适应居中
  options.unit = workerData.pageSizeUnit
  options.format = [workerData.pageSizeWidth, workerData.pageSizeHeight]
  options.orientation = workerData.pageSizeWidth < workerData.pageSizeHeight ? 'p' : 'l'
} else {
  // a3456，b456，单位mm，图片自适应居中
  options.format = workerData.pageSizeType
}
// eslint-disable-next-line new-cap
const doc = new jsPDF(options)
// doc.setProperties({
//   title: filename,
//   subject: appName,
//   author: appName,
//   keywords: `pdf, PDF, 图片, ${appName}`,
//   creator: appName
// })

workerData.fileList.forEach((it, n) => {
  if (!it.nativeImage) it.nativeImage = nativeImage.createFromPath(it.path)
  let {height, width} = it.nativeImage.getSize()
  let w, h // w：页面宽度，h：页面高度
  if (workerData.pageSizeType === '原图') {
    // 原图，以图片默认长宽设置页面大小，单位px
    w = width
    h = height
    if (n > 0) doc.addPage([w, h], w < h ? 'p' : 'l')
  } else if (workerData.pageSizeType === '自定义') {
    // 自定义页面大小，单位可选，图片自适应居中
    w = workerData.pageSizeWidth
    h = workerData.pageSizeHeight
    if (n > 0) doc.addPage()
  } else {
    // a3456，b456，单位mm，图片自适应居中
    w = options.orientation === 'p' ? workerData.pageSizeDef[workerData.pageSizeType][0] : workerData.pageSizeDef[workerData.pageSizeType][1]
    h = options.orientation === 'p' ? workerData.pageSizeDef[workerData.pageSizeType][1] : workerData.pageSizeDef[workerData.pageSizeType][0]
    if (n > 0) doc.addPage()
  }
  let x, y, imgW, imgH
  if (width / height > w / h) {
    imgW = w
    imgH = imgW * height / width
    x = 0
    y = (h - imgH) / 2
  } else {
    imgH = h
    imgW = imgH * width / height
    x = (w - imgW) / 2
    y = 0
  }
  doc.addImage(it.nativeImage.toPNG(), x, y, imgW, imgH)
})
let ab = doc.output('arraybuffer')
let u8 = new Uint8Array(ab)
let exportPath = workerData.userConfig['PicToPdf.ExportPath']
let filePath = _path.join(exportPath, workerData.filename)
fs.writeFile(filePath, u8, () => {
  console.log('ok')
  parentPort.postMessage(filePath)
})
