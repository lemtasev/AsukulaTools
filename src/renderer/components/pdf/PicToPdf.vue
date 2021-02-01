<template>
  <div class="pic-to-pdf">
    <el-scrollbar :native="false" class="ctx">
      <div v-if="fileList.length < 1" class="no-data"><i class="el-icon-picture"></i><span>请添加图片</span></div>
      <div v-for="(item, n) in fileList" :key="item.path + '-' + n" class="pic-line" :class="{'dragging': dragging === item}"
           draggable="true"
           @dragstart="handleDragStart($event, item)"
           @dragover.prevent="handleDragOver($event, item)"
           @dragenter="handleDragEnter($event, item)"
           @dragend="handleDragEnd($event, item)"
      >
        <div class="float-left">
          <span>{{ $utils.formatSize(item.size) }}</span>
        </div>
        <img class="img-preview" :src="'file:///' + item.path" :title="item.path"
             :style="{width: (5 + 75 * imgScale / 100) + '%'}"/>
        <div class="float-right">
          <el-button size="mini" icon="el-icon-close" circle @click="delPic(n)" title="删除"></el-button>
        </div>
      </div>
    </el-scrollbar>
    <div class="bottom-box">
      <div class="btn-line">
        <span class="btn-line-span" title="不影响结果">预览缩放</span>
        <div class="btn-line-div">
          <el-slider v-model="imgScale" :show-tooltip="false"></el-slider>
        </div>
      </div>
      <div class="btn-line">
        <span class="btn-line-span">导出尺寸</span>
        <div class="btn-line-div">
          <el-radio-group v-model="pageSizeType" size="mini">
            <el-radio-button label="原图">原图</el-radio-button>
            <el-radio-button label="a3">A3</el-radio-button>
            <el-radio-button label="a4">A4</el-radio-button>
            <el-radio-button label="a5">A5</el-radio-button>
            <el-radio-button label="a6">A6</el-radio-button>
            <el-radio-button label="b4">B4</el-radio-button>
            <el-radio-button label="b5">B5</el-radio-button>
            <el-radio-button label="b6">B6</el-radio-button>
            <el-radio-button label="自定义">自定义</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="btn-line" :class="{'hidden': pageSizeType !== '自定义'}">
        <span class="btn-line-span">页面宽度</span>
        <el-input-number
            size="mini"
            placeholder="请输入"
            v-model="pageSizeWidth">
        </el-input-number>
        <span class="btn-line-span">页面高度</span>
        <el-input-number
            size="mini"
            placeholder="请输入"
            v-model="pageSizeHeight">
        </el-input-number>
        <span class="btn-line-span">单位</span>
        <el-select style="padding-right: 16px;width: 130px;" v-model="pageSizeUnit" placeholder="单位" size="mini">
          <el-option key="pt" label="pt" value="pt"></el-option>
          <el-option key="px" label="px" value="px"></el-option>
          <el-option key="in" label="in" value="in"></el-option>
          <el-option key="mm" label="mm" value="mm"></el-option>
          <el-option key="cm" label="cm" value="cm"></el-option>
          <el-option key="ex" label="ex" value="ex"></el-option>
          <el-option key="em" label="em" value="em"></el-option>
          <el-option key="pc" label="pc" value="pc"></el-option>
        </el-select>
      </div>
      <div class="btn-line" :class="{'hidden': pageSizeType === '原图' || pageSizeType === '自定义'}">
        <span class="btn-line-span">页面方向</span>
        <div class="btn-line-div">
          <el-radio-group v-model="orientationStr" size="mini" @change="orientationChange">
            <el-radio-button label="横向" title="横向"><i class="el-icon-tickets" style="transform: rotate(-90deg)"></i>
            </el-radio-button>
            <el-radio-button label="纵向" title="纵向"><i class="el-icon-tickets"></i></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="btn-line" style="justify-content: flex-end">
        <span style="margin: 0 8px">共{{fileList.length}}张图，合计{{totalSize}}</span>
        <el-button size="mini" icon="el-icon-minus" @click="delAll" :disabled="fileList.length < 1">清空全部</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addPic">添加图片</el-button>
        <el-button type="success" size="mini" icon="el-icon-download"
                   @click="toPdf"
                   :disabled="fileList.length < 1"
                   :loading="toPdfLoading">
          转为PDF
        </el-button>
      </div>
      <div class="btn-line">
        <el-progress style="width: 100%"
          :text-inside="true" 
          :stroke-width="20" 
          :percentage="progressPercentage" 
          :color="progressColors">
        </el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import _path from 'path'
// import jsPDF from 'jspdf'

export default {
  name: 'PicToPdf',
  data () {
    return {
      imgScale: 30, // 图片预览缩放
      fileList: [], // 图片列表
      dragging: null, // 抓起的图片元素

      // 默认纸张规格，单位mm
      pageSizeDef: {
        a3: [297, 420],
        a4: [210, 297],
        a5: [148, 210],
        a6: [105, 144],
        b4: [250, 353],
        b5: [176, 250],
        b6: [125, 176]
      },
      pageSizeType: '原图', // 导出尺寸
      pageSizeWidth: 750,
      pageSizeHeight: 1334,
      pageSizeUnit: 'px',
      orientationStr: '纵向',
      orientation: 'p',
      toPdfLoading: false,

      userConfig: this.$store.getters['Config/getUserConfig'],
      progressPercentage: 0,
      progressColors: [
        {color: 'rgb(221, 221, 221)', percentage: 0},
        {color: 'rgb(65, 155, 255)', percentage: 99},
        {color: 'rgb(100, 200, 60)', percentage: 100}
      ]
    }
  },
  computed: {
    totalSize () {
      return this.$utils.formatSize(this.fileList.reduce((pre, cur) => {
        return pre + cur.size
      }, 0))
    }
  },
  created () {
    console.log(`${this.$options.name} created`)
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  methods: {
    addPic () {
      console.log('add pic')
      this.$electron.remote.dialog.showOpenDialog({
        filters: [
          {name: '图片', extensions: ['jpg', 'png']}
        ],
        properties: [
          'openFile',
          'multiSelections'
        ]
      }).then(result => {
        result.filePaths.forEach(it => {
          let fileStat = fs.statSync(it)
          // let nativeImage = this.$electron.nativeImage.createFromPath(it)
          // let {height, width} = nativeImage.getSize()
          this.fileList.push({
            name: _path.basename(it),
            size: fileStat.size,
            path: it
            // dataUrl: nativeImage.toPNG(),
            // height: height,
            // width: width
          })
        })
      }).catch(err => console.log(err))
    },
    delPic (n) {
      this.fileList.splice(n, 1)
    },
    delAll () {
      this.fileList = []
    },
    orientationChange (e) {
      this.orientation = e === '纵向' ? 'p' : 'l'
    },
    toPdf () {
      if (this.fileList.length < 1) {
        this.$message({
          showClose: true,
          message: '请添加图片',
          type: 'warning' // success/warning/info/error
        })
        return
      }
      this.toPdfLoading = true
      this.progressPercentage = 0
      const filename = `${this.$moment().format('YYYY-MM-DD-HH-mm-ss')}.pdf`
      let data = {
        filename: filename,
        orientation: this.orientation,
        pageSizeType: this.pageSizeType,
        fileList: this.fileList,
        pageSizeUnit: this.pageSizeUnit,
        pageSizeWidth: this.pageSizeWidth,
        pageSizeHeight: this.pageSizeHeight,
        userConfig: this.userConfig
      }
      this.$process.create('create-pdf.js', data, res => {
        console.log('now persents', res)
        this.progressPercentage = Number.parseFloat((res.data * 100).toFixed(0))
      }).then(filePath => {
        let autoOpenFolder = this.userConfig['PicToPdf.AutoOpenFolder']
        if (autoOpenFolder) this.$electron.shell.showItemInFolder(filePath)
      }).finally(() => {
        this.toPdfLoading = false
      })
    },
    handleDragStart (e, item) {
      this.dragging = item
    },
    handleDragEnd (e, item) {
      this.dragging = null
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver (e) {
      e.dataTransfer.dropEffect = 'move' // 在dragenter中针对放置目标来设置!
    },
    handleDragEnter (e, item) {
      e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return
      }
      const newItems = [...this.fileList]
      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(item)
      newItems.splice(dst, 0, ...newItems.splice(src, 1))
      this.fileList = newItems
    }
  }
}
</script>

<style lang="less" scoped>
.pic-to-pdf {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .ctx {
    width: 100%;
    flex: 1;

    .no-data {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: @wxColorGray;

      i {
        font-size: 128px;
      }
    }

    .pic-line {
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &:not(.btn):hover {
        background: @themeColor20;
      }

      &.dragging {
        background: @themeColor40;
      }

      .img-preview {
        //max-height: 100px;
        padding: 0;
      }

      .float-left, .float-right {
        padding: 0 8px;
        position: absolute;
        top: 0;
        width: auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .float-left {
        left: 0;
      }
      .float-right {
        right: 0;
      }
    }
  }

  .bottom-box {
    width: 100%;
    height: auto;
    background-color: white;

    .btn-line {
      width: calc(100% - 32px);
      padding: 0 16px;
      margin: 8px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
      transition: all .3s;
      max-height: 60px;

      &.hidden {
        max-height: 0;
        margin: 0;
      }

      .btn-line-span {
        padding: 0 8px 0 0;
        width: 70px;
        text-align: right;
      }

      .btn-line-div {
        padding: 0;
        flex: 1;
      }
    }
  }
}
</style>
