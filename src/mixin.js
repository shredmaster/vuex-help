

const vuexHelpMixin = function (modules) {
  return {
    beforeCreate () {
      const options = this.$options
      if (!options.computed) options.computed = {}
      if (options.computed.$h) return
      const adapter = Adapter(this)
      options.computed.$h = function () {
        return recursiveDecorator(modules, adapter)
      }
    }
  }
}

export default function (Vue, options) {
  const version = Number(Vue.version.split('.')[0])
  if (version > 2) {
    throw Error('version not supported')
  }
  Vue.mixin(vuexHelpMixin(options))
}
