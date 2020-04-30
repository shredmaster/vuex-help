<template>
  <ul>
    <li
      v-for="product in allProducts"
      :key="product.id">
      {{ product.title }} - {{ product.price | currency }}
      <br>
      <button
        :disabled="!product.inventory"
        @click="$h.dispatch.cart.addProductToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>

export default {
  computed: {
    allProducts () {
      return this.$h.state.products.all
    }
  },
  created () {
    console.log('get all')
    this.$h.dispatch.products.getAllProducts()
  }
}
</script>
