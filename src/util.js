export function mapStore (store, modules) {
  modules = modules || store._modules.root._rawModule.modules
  return walkObject(modules, new ModuleFactory(store))
}

export function walkObject (obj, factory, path = [], nodes = {}) {
  const val = Object.keys(obj).reduce((acc, key) => {
    const propVal = obj[key]
    path.push(key)
    if (isObject(propVal) && nodes[propVal] !== propVal) {
      nodes[propVal] = propVal
      return { ...acc, [key]: walkObject(propVal, factory, path, nodes) }
    }
    const value = factory.create(path, propVal)
    path.pop()
    return { ...acc, [key]: value }
  }, {})
  const result = factory.create(path, val)
  path.pop()
  return result
}

export class ModuleFactory {
  constructor (store) {
    this.context = store
  }

  create (path, val) {
    const [module, type, name] = path
    if (path.length === 2 && type === 'state') {
      return this.context.state[module]
    }
    const eventName = `${module}/${name}`
    if (module && name && path.length === 3) {
      switch (type) {
        case 'mutations':
          return this.applyFun(function (...arg) {
            this.commit(eventName, ...arg)
          })
        case 'actions' :
          return this.applyFun(function (...arg) {
            this.dispatch(eventName, ...arg)
          })
        case 'getters' :
          return this.context.getters[eventName]
      }
    }
    return val
  }

  applyFun (func) {
    return (...args) => func.apply(this.context, args)
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
