import { mapStore, assert } from './util'

let Vue
export default function (_Vue, options = {}) {
  assert(Vue !== _Vue, 'already installed')

  Vue = _Vue

  const descriptor = {
    get () {
      return this.$root.$_h
    }
  }
  const { name = '$h' } = options
  Object.defineProperty(Vue.prototype, name, descriptor)

  Vue.mixin(
    {
      beforeCreate () {
        if (this.$root === this) {
          this.$_h = mapStore(this.$store, options)
        }
      }
    })
}
