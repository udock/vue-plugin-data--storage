import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import set from 'lodash/set'

import mitt from 'mitt'

class StorageManager {
  constructor ({ preFix } = {}) {
    this.preFix = preFix || ''
    this.emitter = mitt()
  }

  watch (key, cb) {
    this.emitter.on(key, cb)
    return () => {
      this.emitter.off(key, cb)
    }
  }

  get (key, defaultValue) {
    const value = localStorage.getItem(this.preFix + key)
    if (value == null) {
      return defaultValue
    }
    return JSON.parse(value)
  }

  set (key, value) {
    localStorage.setItem(this.preFix + key, JSON.stringify(value))
    this.emitter.emit(key, value)
  }
}

export default function (options = {}) {
  const sm = new StorageManager({ preFix: options.preFix })

  return {
    enter () {
      return {}
    },
    after (vm, out, $tasks) {

    },
    each (vm, config, name, out, $tasks) {
      if (isString(config)) {
        config = {
          path: config
        }
      } else if (isArray(config)) {
        config = {
          path: config[0],
          writeable: true,
          defaultValue: config[1]
        }
      }
      const dataPath = config.path
      const isRef = isObject(sm.get(dataPath, config.defaultValue))
      if (isRef && config.unsafe !== true) {
        console.warn(`${dataPath} is a object! must set unsafe = true`)
        return { get () {} }
      }
      sm.watch(dataPath, (value) => {
        // 把 localStorage 数据的修改同步到本地属性
        set(vm, name, value)
      })
      const taskKey = $tasks.created
      vm[taskKey] = vm[taskKey] || []
      vm[taskKey].push(function () {
        vm.$watch(name, function (value) {
          const dataValue = sm.get(dataPath, config.defaultValue)
          if (dataValue !== value) {
            if (config.writeable) {
              // 可写属性，把本地属性的修改同步到 localStorage 中
              sm.set(dataPath, value)
            } else {
              // 只读属性，恢复到 localStorage 中的值
              if (!config.force_sync) {
                set(vm, name, dataValue)
              }
              console.error(`storage data error: readonly!, value: ${JSON.stringify(value)}, config: {"${name}": ${JSON.stringify(config)}}`)
            }
          }
        })
      })
      return sm.get(dataPath, config.defaultValue)
    }
  }
}
