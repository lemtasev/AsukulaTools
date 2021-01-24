<template>
  <div id="app">
<!--    <Home></Home>-->
    <router-view></router-view>
  </div>
</template>

<script>
import './assets/iconfont/iconfont.css'
// import Home from '@/components/Home'

export default {
  name: 'Asukula'
  // components: {Home}
}
</script>

<style lang="less">

/* 可拖动 */
.drag-win {
  -webkit-user-select: none;
  -webkit-app-region: drag !important;

  * {
    -webkit-app-region: no-drag;
  }
}

/* 禁止图片拖动 */
img {
  -webkit-user-drag: none;
}

ul, li{
  margin: 0;
  padding: 0;
  list-style:none
}

/*========== 自定义滚动条 ==========*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: none;
}

::-webkit-scrollbar-thumb { /*滚动条滑块*/
  border-radius: 3px;
  background: rgba(177, 177, 177, 0.6);
  -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, .2), inset 0 0 2px rgba(255, 255, 255, 1);
}

::-webkit-scrollbar-thumb:hover { /*滚动条滑块*/
  background: rgba(177, 177, 177, 0.9);
}

::-webkit-scrollbar-track { /*滚动条里面轨道*/
  background: none;
}

.auto-hide-scrollbar {

}

.auto-hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.auto-hide-scrollbar:hover::-webkit-scrollbar {
  display: block;
}

/*========== 自定义滚动条 ==========*/

/*========== CSS ==========*/
body {
  margin: 0;
  user-select: none;
  font-size: @fontSizeTiny;
  color: @fontColorBlack;
  font-family: "MicrosoftYaHei";
  background-color: @colorBkg;
}

#app {
  height: 100vh;
}

.down {
  transform: rotate(180deg);
}

.rotate90 {
  transform: rotate(90deg);
}

.border-top-none {
  border-top: 0 !important;
}

.border-none {
  border: none !important;
}

.help-info {
  padding: 20px;
  color: #777;
  font-size: 20px;
}

.t-indent-2 {
  text-indent: 2em;
}

.visibility-hidden {
  visibility: hidden !important;
}

.visibility-visible {
  visibility: visible !important;
}

.pd-0 {
  padding: 0 !important;
}

.ml-5 {
  margin-left: 5px !important;
}

.ml-10 {
  margin-left: 10px !important;
}

.ml-20 {
  margin-left: 20px !important;
}

.mt-10 {
  margin-top: 10px !important;
}

.mt-20 {
  margin-top: 20px !important;
}

.mt-40 {
  margin-top: 40px !important;
}

.mt-80 {
  margin-top: 80px !important;
}

.mr-10 {
  margin-right: 10px !important;
}

.jc-c {
  justify-content: center !important;
}

.jc-fe {
  justify-content: flex-end !important;
}

.jc-sa {
  justify-content: space-around !important;
}

.jc-sb {
  justify-content: space-between !important;
}

.jc-se {
  justify-content: space-evenly !important;
}

.font-weight-lighter {
  font-weight: lighter !important;
}

.font-weight-bold {
  font-weight: bold !important;
}

.font-size-32 {
  font-size: @fontSize32 !important;
}

.font-size-28 {
  font-size: @fontSize28 !important;
}

.font-size-big {
  font-size: @fontSizeBig !important;
}

.font-size-normal {
  font-size: @fontSizeNormal !important;
}

.font-size-small {
  font-size: @fontSizeSmall !important;
}

.font-size-tiny {
  font-size: @fontSizeTiny !important;
}

/*==========自定义element UI样式==========*/
.el-drawer {
  outline: 0 !important;
}

.setting-drawer > section {
  height: 100%;
}

/*==========自定义element UI样式==========*/
</style>
