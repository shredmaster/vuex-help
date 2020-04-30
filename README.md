# vuex-help

a plugin offers more natural API for [Vuex](http://vuex.vuejs.org/).

<hr />

## Requirements

- [Vue.js](https://vuejs.org) (v2.0.0+)
- [Vuex](http://vuex.vuejs.org) (v2.0.0+)
- Vue.use(Vuex) is installed
- All Vuex state, getters and actions are organized into [Vuex modules](https://vuex.vuejs.org/en/modules.html).

## Motivations
Improve some of the difficulties of the existing api and mapXXX helpers.

1. bad readability
2. magic strings are hard to maintain and refactor
3. can't navigate to the source in the IDE

## Usage
minimal example how to access actions and mutations without using mapXX helpers and magic string

```js
export default {
  computed: {
    cart () {
      const { cartProducts: products, cartTotalPrice: total } = this.$h.getters.cart
      const { checkoutStatus } = this.$h.state.cart
      return {
        products,
        total,
        checkoutStatus
      }
    }
  },
  methods: {
    checkout (products) {
      this.$h.dispatch.cart.checkout(products)
    }
  }
}
```
note: v0.2.4 supports two different helper formats. see Api documentation for more detail.

```html
<div class="cart">
    <h2>Your Cart</h2>
    <p v-show="!cart.products.length"><i>Please add some products to cart.</i></p>
    <ul>
      <li
        v-for="product in cart.products"
        :key="product.id">
        {{ product.title }} - {{ product.price | currency }} x {{ product.quantity }}
      </li>
    </ul>
    <p>Total: {{ cart.total | currency }}</p>
    <p><button :disabled="!cart.products.length" @click="checkout(cart.products)">Checkout</button></p>
    <p v-show="cart.checkoutStatus">Checkout {{ cart.checkoutStatus }}.</p>
  </div>
```

## Install

```bash
npm install --save @golml/vuex-help
```

```js
// example/shopping-cart/app.js
import Vue from 'vue'
import VuexHelp from 'vuex-help'
Vue.use(VuexHelp)
```

Check out full example on [shopping-cart-vuex](https://github.com/shredmaster/vuex-help/tree/master/examples/shopping-cart-vuex).

## Nuxt.js
install vuex-help as [nuxtjs plugin](https://nuxtjs.org/guide/plugins/)
```js
// vuex-help.plugin.js 
export default function (ctx, inject) {
  const { store } = ctx
  const vuexHelp = mapStore(store)
  inject('h', vuexHelp)
}
```
```js
// nuxt.config.js
{
  plugins: [{ src: '~/plugins/vuex-help.plugin.js'}]
}
```


## API

### `Vue.use(VuexHelp, options)` (v0.2.4)

Creates a new instance of the plugin with the given options. The following options
can be provided to configure the plugin for your specific needs:


- `name <String>`: The key for define property name on Vue.prototype. Defaults to `"$h"`.
- `format <String>`: Specify `"vuex"` for helper object that follow vuex api format. ie. `$h.dispatch.products.getAllProducts()`.
See full example on [shopping-cart-vuex](https://github.com/shredmaster/vuex-help/tree/master/examples/shopping-cart-vuex).
 Specify `"module"` for helper object that follow module format. ie. $h.products.actions.getAllProducts(). See full example on [shopping-cart](https://github.com/shredmaster/vuex-help/tree/master/examples/shopping-cart).
Defaults to `"vuex"`.

## Roadmap
open to feature requests.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
