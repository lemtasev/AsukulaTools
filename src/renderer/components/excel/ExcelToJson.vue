<template>
  <el-scrollbar :native="false" class="excel-to-json">
    <div class="file-select">
      <div class="file-area" :class="{'dragoverClass': isDragOver}" ref='selectFrame' ondragstart="return false">
        <span>将excel文件拖放至此</span>
<!--        <span>或者点击<button @click="chooseFile">选择</button></span>-->
        <span><span>或者点击</span><el-button type="primary" size="mini" icon="el-icon-plus" @click="chooseFile">选择</el-button></span>

      </div>
    </div>
    <table class="file-list-table">
      <thead>
      <tr>
        <td width="10%">序号</td>
        <td>文件名</td>
        <td width="10%">大小</td>
        <td width="30%">路径</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, n) in fileList">
        <td>{{ n + 1 }}</td>
        <td>{{ item.name }}</td>
        <td>{{ $utils.formatSize(item.size) }}</td>
        <td :title="item.path">{{ $utils.centralEllipsis(item.path, {maxLength: 20}) }}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>
<!--          <button @click="getJson">转JSON</button>-->
          <el-button type="success" size="mini" icon="el-icon-download"
                     @click="getJson" :disabled="fileList.length < 1">转JSON</el-button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="result">
      <textarea>{{json}}</textarea>
    </div>
  </el-scrollbar>
</template>

<script>
import fs from 'fs'
import _path from 'path'
import XLSX from 'xlsx'

export default {
  name: 'ExcelToJson',
  data () {
    return {
      isDragOver: false,
      fileList: [],
      json: []
    }
  },
  watch: {},
  created () {
    console.log(`${this.$options.name} created`)
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
    this.$refs.selectFrame.ondragenter = (e) => {
      e.preventDefault() // 阻止拖入时的浏览器默认行为
      this.isDragOver = true
    }
    this.$refs.selectFrame.ondragover = (e) => {
      e.preventDefault() // 阻止拖来拖去的浏览器默认行为
    }
    this.$refs.selectFrame.ondragleave = (e) => {
      e.preventDefault() // 阻止离开时的浏览器默认行为
      this.isDragOver = false
    }
    this.$refs.selectFrame.ondrop = (e) => {
      e.preventDefault() // 阻止拖放后的浏览器默认行为
      this.isDragOver = false
      const files = e.dataTransfer.files
      if (files.length < 1) {
        console.log('未发现文件')
        return
      }
      let fileList = []
      for (let i = 0; i < files.length; i++) {
        let it = files[i]
        let extname = _path.extname(it.path)
        if (extname === '.xls' || extname === '.xlsx') fileList.push(it)
      }
      this.fileList = fileList
    }
  },
  methods: {
    getJson () {
      let json = []
      this.fileList.forEach(it => {
        let workBook = XLSX.readFile(it.path)
        let workSheets = []
        workBook.SheetNames.forEach(sheetName => {
          let workSheet = workBook.Sheets[sheetName]
          let data = XLSX.utils.sheet_to_json(workSheet)
          workSheets.push({
            sheetName: sheetName,
            data: data
          })
        })
        json.push({
          workBookName: it.name,
          workSheets: workSheets
        })
      })
      this.json = json
      console.log(json)
    },
    chooseFile () {
      this.$electron.remote.dialog.showOpenDialog({
        filters: [
          {name: 'Excel', extensions: ['xls', 'xlsx']}
        ],
        properties: [
          'openFile',
          'multiSelections'
        ]
      }).then(result => {
        let fileList = []
        result.filePaths.forEach(it => {
          let fileStat = fs.statSync(it)
          fileList.push({
            name: _path.basename(it),
            size: fileStat.size,
            path: it
          })
        })
        this.fileList = fileList
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.excel-to-json{
  width: 100%;
  height: 100%;
  .file-select {
    display: flex;
    align-items: center;
    justify-content: center;

    .file-area {
      margin: 20px;
      width: 200px;
      height: 200px;
      background-color: #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 4px dashed gray;
    }

    .file-area.dragoverClass {
      border: 4px dashed limegreen;
    }
  }

  .file-list-table{
    margin-left: 2%;
    width: 96%;
  }

  .result{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    textarea{
      width: 96%;
      height: 300px;
      resize: none;
    }
  }
}



</style>
