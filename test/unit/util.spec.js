import {
  find, deepCopy, forEachValue, isObject, isPromise,
  assert,
  mapStore
} from '../../src/util'

describe('util', () => {
  it('mapStore', () => {
    const module = {
      cart: {
        namespaced: true,
        state: { item: [], customer: { address: {}}},
        actions: {
          create () {
          }
        },
        mutations: {
          item () {
          }
        }
      },
      user: {
        namespaced: true,
        state: () => ({ name: 'lin' }),
        actions: {
          login () {},
          logout () {}
        },
        getters: {
          firstName () {}
        }
      }
    }
    const $store = {
      state: {
        cart: { storeState: [] },
        user: { storeState: [] }
      },
      dispatch: jasmine.createSpy('action'),
      commit: jasmine.createSpy('commit'),
      getters: {
        'user/firstName': jasmine.createSpy('commit')
      }
    }
    const store = mapStore($store, module)
    store.cart.actions.create()
    store.cart.mutations.item()
    store.user.getters.firstName()
    const cartState = store.cart.state
    const userState = store.user.state
    expect($store.dispatch).toHaveBeenCalled()
    expect($store.dispatch).toHaveBeenCalledWith('cart/create')
    expect($store.commit).toHaveBeenCalled()
    expect($store.commit).toHaveBeenCalledWith('cart/item')
    expect($store.getters['user/firstName']).toHaveBeenCalled()
    expect(cartState).toEqual({ storeState: [] })
    expect(userState).toEqual({ storeState: [] })
  })

  it('find', () => {
    const list = [33, 22, 112, 222, 43]
    expect(find(list, function (a) { return a % 2 === 0 })).toEqual(22)
  })

  it('deepCopy: nornal structure', () => {
    const original = {
      a: 1,
      b: 'string',
      c: true,
      d: null,
      e: undefined
    }
    const copy = deepCopy(original)

    expect(copy).toEqual(original)
  })

  it('deepCopy: nested structure', () => {
    const original = {
      a: {
        b: 1,
        c: [2, 3, {
          d: 4
        }]
      }
    }
    const copy = deepCopy(original)

    expect(copy).toEqual(original)
  })

  it('deepCopy: circular structure', () => {
    const original = {
      a: 1
    }
    original.circular = original

    const copy = deepCopy(original)

    expect(copy).toEqual(original)
  })

  it('forEachValue', () => {
    let number = 1

    function plus (value, key) {
      number += value
    }
    const origin = {
      a: 1,
      b: 3
    }

    forEachValue(origin, plus)
    expect(number).toEqual(5)
  })

  it('isObject', () => {
    expect(isObject(1)).toBe(false)
    expect(isObject('String')).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject({})).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject([])).toBe(true)
    expect(isObject(new Function())).toBe(false)
  })

  it('isPromise', () => {
    const promise = new Promise(() => {}, () => {})
    expect(isPromise(1)).toBe(false)
    expect(isPromise(promise)).toBe(true)
    expect(isPromise(new Function())).toBe(false)
  })

  it('assert', () => {
    expect(assert.bind(null, false, 'Hello')).toThrowError('[vuex-help] Hello')
  })
})
