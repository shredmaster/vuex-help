<template>
  <ul>
    <li
      v-for="product in allProducts"
      :key="product.id">
      {{ product.title }} - {{ product.price | currency }}
      <br>
      <button
        :disabled="!product.inventory"
        @click="$h.cart.actions.addProductToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>

export default {
  computed: {
    allProducts () {
      return this.$h.products.state.all
    }
  },
  created () {
    this.$h.products.actions.getAllProducts()
  }
}
</script>
