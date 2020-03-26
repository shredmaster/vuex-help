<template>
  <ul>
    <li
      v-for="product in products"
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
import { mapState } from 'vuex'

export default {
  computed: mapState({
    products: state => state.products.all
  }),
  created () {
    this.$h.products.actions.getAllProducts()
  }
}
</script>
