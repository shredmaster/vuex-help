# vuex-help

a helper utility library `to be` for [Vuex](http://vuex.vuejs.org/).

<hr />

## Requirements

- [Vue.js](https://vuejs.org) (v2.0.0+)
- [Vuex](http://vuex.vuejs.org) (v2.0.0+)
- Vue.use(Vuex) is installed

## Usage
Access to state, getters and actions without rely on string constants.

```html
<button @click="$h.cart.actions.addProductToCart(product)">
    Add to cart
</button>
```
or 
```js
  methods: {
    addProductToCart (product) {
      this.$h.cart.actions.addProductToCart(product)
    }
  }
```

same notation apply to mutations and getters

## Install

```bash
npm install --save @lml/vuex-help
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
