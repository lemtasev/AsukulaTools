<template>
  <div class="container">
    <el-table
        :data="appMetrics"
        size="mini"
        :show-summary="true"
        :summary-method="getSummaries"
        height="80%"
        :row-class-name="tableRowClassName"
        style="width: 100%">

      <el-table-column
          type="index"
          fixed>
      </el-table-column>

      <el-table-column
          prop="pid"
          label="进程ID"
          fixed>
      </el-table-column>

      <el-table-column
          prop="type"
          label="类型"
          fixed>
      </el-table-column>

      <el-table-column
          prop="name"
          label="进程名">
      </el-table-column>

      <el-table-column label="CPU">
        <el-table-column
            prop="cpu.percentCPUUsage"
            width="120"
            sortable
            :formatter="formatCPUUsage">
          <span slot="header" slot-scope="scope" title="自上次调用getCPUUsage以来使用的CPU百分比">百分比</span>
        </el-table-column>
        <el-table-column
            prop="cpu.idleWakeupsPerSecond"
            width="120"
            sortable>
          <span slot="header" slot-scope="scope" title="自上次调用getCPUUsage以来每秒平均空闲CPU唤醒数">平均唤醒数</span>
        </el-table-column>
      </el-table-column>

      <!--所有数据值以KB为单位-->
      <el-table-column label="内存">
        <el-table-column
            prop="memory.workingSetSize"
            width="120"
            sortable
            :formatter="formatMemory">
          <span slot="header" slot-scope="scope" title="当前占用的物理内存RAM总量">物理内存</span>
        </el-table-column>
        <el-table-column
            prop="memory.peakWorkingSetSize"
            width="120"
            sortable
            :formatter="formatMemory">
          <span slot="header" slot-scope="scope" title="已被占用的物理内存最大值">最大值</span>
        </el-table-column>
        <el-table-column
            prop="memory.privateBytes"
            width="120"
            sortable
            :formatter="formatMemory">
          <span slot="header" slot-scope="scope" title="（windows）独占的内存，不被其他进程（如JavaScript堆或者HTML内容）共享的内存数量">独占的内存</span>
        </el-table-column>
      </el-table-column>

      <el-table-column
          prop="creationTime"
          width="150"
          sortable
          :formatter="formatTime">
        <span slot="header" slot-scope="scope" title="时间表示为从epoch开始的毫秒数。由于pid可以在流程结束后重用，因此使用pid和creationTime来唯一标识流程是很有用的。">进程创建时间</span>
      </el-table-column>

      <el-table-column
          prop="sandboxed"
          :formatter="formatBoolean">
        <span slot="header" slot-scope="scope" title="进程是否在操作系统级别上被沙盒化">沙盒</span>
      </el-table-column>

      <el-table-column
          prop="integrityLevel">
        <span slot="header" slot-scope="scope" title="（windows属性）进程整体评价">整体等级</span>
      </el-table-column>

    </el-table>
    <span>{{runtimeVersions}}</span>
  </div>
</template>

<script>
export default {
  name: 'AppMetrics',
  data () {
    return {
      interval: null,
      lastNotificationTime: 0,
      appMetrics: {},
      runtimeVersions: {}
    }
  },
  watch: {},
  created () {
    console.log(`${this.$options.name} created`)
    this.appMetrics = this.$electron.remote.app.getAppMetrics()
    console.log(this.appMetrics)
    this.interval = setInterval(() => {
      this.appMetrics = this.$electron.remote.app.getAppMetrics()
    }, 3000)

    this.runtimeVersions = process.versions
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (row.integrityLevel === 'high') {
        return 'warning-row'
      }
      return ''
    },
    getSummaries ({columns, data}) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        let values
        if (column.property === 'cpu.percentCPUUsage' ||
            column.property === 'cpu.idleWakeupsPerSecond' ||
            column.property === 'memory.workingSetSize' ||
            column.property === 'memory.peakWorkingSetSize' ||
            column.property === 'memory.privateBytes') {
          values = data.map(item => {
            let p = column.property.split('.')
            return item[p[0]][p[1]]
          })
        } else {
          values = data.map(item => {
            return item[column.property]
          })
        }
        sums[index] = values.reduce((total, current) => {
          const value = Number(current)
          if (!isNaN(value)) {
            return total + current
          } else {
            return total
          }
        }, 0)
        if (column.property === 'cpu.percentCPUUsage') {
          let warningPersent = 30
          let nowtime = new Date().getTime()
          if (sums[index] > warningPersent && (nowtime - this.lastNotificationTime) > 10000) {
            this.lastNotificationTime = nowtime
            let notification = new this.$electron.remote.Notification({
              title: '警告',
              body: `${this.$electron.remote.app.getName()}的CPU占用率${this.formatCPUUsage(null, null, sums[index])}，超过${warningPersent}%`
            })
            notification.show()
          }
          sums[index] = this.formatCPUUsage(null, null, sums[index])
        } else if (column.property === 'cpu.idleWakeupsPerSecond') {
        } else if (column.property === 'memory.workingSetSize' ||
            column.property === 'memory.peakWorkingSetSize' ||
            column.property === 'memory.privateBytes') {
          sums[index] = this.formatMemory(null, null, sums[index])
        } else {
          sums[index] = '/'
        }
      })
      return sums
    },
    formatCPUUsage (row, column, cellValue, index) {
      return cellValue.toFixed(2) + '%'
    },
    formatTime (row, column, cellValue, index) {
      return this.$moment(cellValue).format('YYYY-MM-DD-HH-mm-ss')
    },
    formatMemory (row, column, cellValue, index) {
      return this.$utils.formatSize(cellValue * 1024)
    },
    formatBoolean (row, column, cellValue, index) {
      return cellValue ? '是' : '否'
    }
  }
}
</script>

<style lang="less">
.el-table__row.warning-row {
  background-color: @colorWarning !important;
}
</style>
<style lang="less" scoped>

.container{
  width: 100%;
  height: 100%;
}

</style>
