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
</script>
