# vuex-help

a helper utility library `to be` for [Vuex](http://vuex.vuejs.org/).

<hr />

## Requirements

- [Vue.js](https://vuejs.org) (v2.0.0+)
- [Vuex](http://vuex.vuejs.org) (v2.0.0+)
- Vue.use(Vuex) is installed
- All Vuex state, getters and actions are organized into [Vuex modules](https://vuex.vuejs.org/en/modules.html).

## Usage
Alternative helpers to access getters, mutations, state and actions without relying on string constants.

```html
<template>
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
</template>
```

```js
export default {
  computed: {
    cart () {
      const { cartProducts: products, cartTotalPrice: total } = this.$h.cart.getters
      const { checkoutStatus } = this.$h.cart.state
      return {
        products,
        total,
        checkoutStatus
      }
    }
  },
  methods: {
    checkout (products) {
      this.$h.cart.actions.checkout(products)
    }
  }
}
```

## Install

```bash
npm install --save @golml/vuex-help
```

```js
// example/shopping-cart/store/index.js
export const modules = {
  cart,
  products
}
```

```js
// example/shopping-cart/app.js
import Vue from 'vue'
import VuexHelp from 'vuex-help'
import { modules } from './store'
Vue.use(VuexHelp, { modules })
```

Check out full example on [shopping-cart](https://github.com/shredmaster/vuex-help/tree/master/examples/shopping-cart).


## Roadmap
open to feature requests.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
