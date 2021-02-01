import _path from 'path'
import fs from 'fs'
import {nativeImage} from 'electron'
import jsPDF from 'jspdf'

/**
 * 子线程执行的js模块，需要export一个start()方法
 * 第一个参数data，为调用传参
 * 第二个参数sendInfo(response)是一个function，执行该函数可向主线程发送消息
 */
export function start (data, sendInfo) {
  return new Promise((resolve, reject) => {
    let options = {
      orientation: data.orientation,
      compress: true
    }
    if (data.pageSizeType === '原图') {
      // 原图，以图片默认长宽设置页面大小，单位px
      if (!data.fileList[0].nativeImage) data.fileList[0].nativeImage = nativeImage.createFromPath(data.fileList[0].path)
      let {height, width} = data.fileList[0].nativeImage.getSize()
      options.unit = 'px'
      options.format = [width, height]
      options.orientation = width < height ? 'p' : 'l'
    } else if (data.pageSizeType === '自定义') {
      // 自定义页面大小，单位可选，图片自适应居中
      options.unit = data.pageSizeUnit
      options.format = [data.pageSizeWidth, data.pageSizeHeight]
      options.orientation = data.pageSizeWidth < data.pageSizeHeight ? 'p' : 'l'
    } else {
      // a3456，b456，单位mm，图片自适应居中
      options.format = data.pageSizeType
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
    data.fileList.forEach((it, n) => {
      if (!it.nativeImage) it.nativeImage = nativeImage.createFromPath(it.path)
      let {height, width} = it.nativeImage.getSize()
      let w, h // w：页面宽度，h：页面高度
      if (data.pageSizeType === '原图') {
        // 原图，以图片默认长宽设置页面大小，单位px
        w = width
        h = height
        if (n > 0) doc.addPage([w, h], w < h ? 'p' : 'l')
      } else if (data.pageSizeType === '自定义') {
        // 自定义页面大小，单位可选，图片自适应居中
        w = data.pageSizeWidth
        h = data.pageSizeHeight
        if (n > 0) doc.addPage()
      } else {
        // a3456，b456，单位mm，图片自适应居中
        w = options.orientation === 'p' ? data.pageSizeDef[data.pageSizeType][0] : data.pageSizeDef[data.pageSizeType][1]
        h = options.orientation === 'p' ? data.pageSizeDef[data.pageSizeType][1] : data.pageSizeDef[data.pageSizeType][0]
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
      sendInfo && sendInfo((n + 1) / data.fileList.length)
    })
    let ab = doc.output('arraybuffer')
    let u8 = new Uint8Array(ab)
    let exportPath = data.userConfig['PicToPdf.ExportPath']
    let filePath = _path.join(exportPath, data.filename)
    fs.writeFile(filePath, u8, () => {
      resolve(filePath)
    })
  })
}
