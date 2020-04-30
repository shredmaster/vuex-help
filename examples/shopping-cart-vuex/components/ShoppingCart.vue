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

<script>
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
</script>
