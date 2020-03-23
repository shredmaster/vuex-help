export function walkObject (obj, factory, path = []) {
  const val = Object.keys(obj).reduce((acc, key) => {
    const propVal = obj[key]
    path.push(key)
    if (isObject(propVal)) {
      return { ...acc, [key]: walkObject(propVal, factory, path) }
    }
    const value = factory.create(path, propVal)
    path.pop()
    return { ...acc, [key]: value }
  }, {})
  const result = factory.create(path, val)
  path.pop()
  return result
}

export class HelpFactory {
  constructor (component) {
    this.component = component
  }

  create (path, val) {
    const [module, type, name] = path
    if (type === 'state') return val
    const eventName = `${module}/${name}`
    if (module && name) {
      assert(isFunction(val), 'value must be an function')
      switch (type) {
        case 'mutations':
          return function (...arg) {
            this.$store.commit(eventName, ...arg)
          }.bind(this.component)
        case 'actions' :
          return function (...arg) {
            this.$store.dispatch(eventName, ...arg)
          }.bind(this.component)
        case 'getters' :
          return function (...arg) {
            this.$store.getters[eventName](...arg)
          }.bind(this.component)
      }
    }
    return val
  }

  space (depth) {
    return Array(depth).fill('--').join('')
  }
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

export function isPromise (val) {
  return val && typeof val.then === 'function'
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex-help] ${msg}`)
}

export function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}
