import { remote } from 'electron'

class SysMenus {
  _menus = [
    {
      name: '进程数据',
      icon: '/src/renderer/assets/icons/aichong02.png',
      link: '/sys/AppMetrics'
    },
    {
      name: '设置',
      icon: '/src/renderer/assets/icons/aichong01.png',
      link: '/sys/Settings'
    },
    {
      name: 'Excel to JSON',
      icon: '/src/renderer/assets/icons/aichong07.png',
      link: '/excel/ExcelToJson'
    },
    {
      name: '图片转PDF',
      icon: '/src/renderer/assets/icons/aichong03.png',
      link: '/pdf/PicToPdf'
    },
    {
      name: '404页面',
      icon: '/src/renderer/assets/icons/aichong09.png',
      link: '/common/Cmp404'
    }
  ]
  get (link) {
    if (!link) {
      return this._menus
    }
    return this._menus.filter(it => it.link === link)[0]
  }
}
const sysMenus = new SysMenus()
export { sysMenus }

class SysSettings {
  _settings = [
    {
      active: false,
      title: 'General',
      text: '通用设置',
      settings: [
        {
          name: 'ShowAside',
          text: '显示侧边栏',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'AutomaticallyStartAtBoot',
          text: '开机时自动启动',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'TestInput',
          text: '测试input',
          type: 'input',
          defaultValue: '测试input'
        },
        {
          name: 'TestTextarea',
          text: '测试textarea',
          type: 'textarea',
          defaultValue: '测试textarea'
        },
        {
          name: 'TestSelect',
          text: '测试select',
          type: 'select',
          defaultValue: 'bbb',
          options: [
            {
              text: '选项aaa',
              value: 'aaa'
            },
            {
              text: '选项bbb',
              value: 'bbb'
            }
          ]
        }
      ]
    },
    {
      active: false,
      title: 'UserInterface',
      text: '用户界面',
      settings: [
        {
          name: 'TestCheckbox',
          text: '测试checkbox',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'TestInput',
          text: '测试input',
          type: 'input',
          defaultValue: '测试input'
        },
        {
          name: 'TestTextarea',
          text: '测试textarea',
          type: 'textarea',
          defaultValue: '测试textarea'
        },
        {
          name: 'TestSelect',
          text: '测试select',
          type: 'select',
          defaultValue: 'bbb',
          options: [
            {
              text: '选项aaa',
              value: 'aaa'
            },
            {
              text: '选项bbb',
              value: 'bbb'
            }
          ]
        }
      ]
    },
    {
      active: false,
      title: 'Keymap',
      text: '快捷按键',
      settings: [
        {
          name: 'TestCheckbox',
          text: '测试checkbox',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'TestInput',
          text: '测试input',
          type: 'input',
          defaultValue: '测试input'
        },
        {
          name: 'TestTextarea',
          text: '测试textarea',
          type: 'textarea',
          defaultValue: '测试textarea'
        },
        {
          name: 'TestSelect',
          text: '测试select',
          type: 'select',
          defaultValue: 'bbb',
          options: [
            {
              text: '选项aaa',
              value: 'aaa'
            },
            {
              text: '选项bbb',
              value: 'bbb'
            }
          ]
        }
      ]
    },
    {
      active: false,
      title: 'PicToPdf',
      text: '图片转PDF',
      settings: [
        {
          name: 'ExportPath',
          text: '导出路径',
          type: 'choose-folder',
          defaultValue: remote.app.getPath('downloads')
        },
        {
          name: 'AutoOpenFolder',
          text: '导出完成后自动打开文件夹',
          type: 'checkbox',
          defaultValue: true
        }
      ]
    }
  ]
  constructor () {
    this._defaultConfig = {}
    this._settings.forEach(titleItem => {
      titleItem.settings.forEach(nameItem => {
        let key = `${titleItem.title}.${nameItem.name}`
        let value = nameItem.defaultValue
        this._defaultConfig[key] = value
      })
    })
  }
  get () {
    return JSON.parse(JSON.stringify(this._settings))
    // return this._settings
  }
  getDefaultConfig () {
    return JSON.parse(JSON.stringify(this._defaultConfig))
    // return this._defaultConfig
  }
}
const sysSettings = new SysSettings()
export { sysSettings }
