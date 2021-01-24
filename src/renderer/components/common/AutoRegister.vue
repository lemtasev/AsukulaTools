<template>
  <div class="tab-container" v-show="item.active">
    <component :is="autoImport"></component>
  </div>
</template>

<script>
// import Vue from 'vue'

export default {
  name: 'AutoRegister',
  data () {
    return {}
  },
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  watch: {},
  computed: {
    autoImport: function () {
      let myComponent = () => import(`@/components${this.item.link}`)
      return myComponent
    }
  },
  // created () {
  //   console.log(`${this.$options.name} created`)
  // },
  // mounted () {
  //   console.log(`${this.$options.name} mounted`)
  //   // let that = this
  //   // import('@/components' + that.item.link).then(component => {
  //   //   let constructor = Vue.extend(component.default)
  //   //   let instance = new constructor()
  //   //   instance.$mount(that.$refs.componentRef)
  //   //   console.log(that.item.link + ' 加载成功')
  //   // }).catch(err => {
  //   //   console.log(that.item.link + ' 加载失败')
  //   //   console.error(err)
  //   //   import('@/components/common/Cmp404').then(component => {
  //   //     let constructor = Vue.extend(component.default)
  //   //     let instance = new constructor()
  //   //     instance.$mount(that.$refs.componentRef)
  //   //   })
  //   // })
  // },
  methods: {}
}
</script>

<style lang="less" scoped>
.tab-container {
  width: 100%;
  height: 100%
}
</style>
