export function recursiveDecorator (obj, adapter) {
  return Object.keys(obj).reduce((acc, key) => {
    const objProp = obj[key]
    switch (typeof objProp) {
      case 'object':
        return { ...acc, [key]: recursiveDecorator(objProp, adapter) }

      case 'function':
        return { ...acc, [key]: adapter(objProp) }
    }
    return { ...acc, [key]: objProp }
  }, {})
}

export const adapter = (component) => {
  return {
    keys: [],
    push: (key) => {
      console.log(this.key, this.keys)
      this.keys.push(key)
      console.log(this.keys)
    },
    pop: () => {
      this.keys.pop()
    },
    adapt: (fn) => {
      console.log(this.keys)
      console.log(fn)
      return fn
    }
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
