const { formatPrice } = require('./utils')

// === Carrinho
const Cart = {
  init(oldCart) {
    if(oldCart) {
      this.items = oldCart.items
      this.total = oldCart.total
    } else {
      this.items = []
      this.total = {
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }
    }

    return this
  },

  // === Add Item
  addOne(product) {
    // Check if exist item in Cart
    let inCart = this.getCartItem(product.id)

    // if not exist
    if(!inCart) {
      inCart = {
        product: {
          ...product,
          formattedPrice: formatPrice(product.price)
        },

        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }

      this.items.push(inCart)
    }

    // Check quantity max
    if(inCart.quantity >= product.quantity) return this

    // Update item cart
    inCart.quantity++
    inCart.price = inCart.product.price * inCart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)

    // Update cart
    this.total.quantity++
    this.total.price += inCart.product.price
    this.total.formattedPrice = formatPrice(this.total.price)

    return this
  },

  // === Remove Item
  removeOne(productId) {
    // Check if exist item in Cart
    const inCart = this.getCartItem(productId)

    // if not exist
    if(!inCart) return this

    // Update item cart
    inCart.quantity--
    inCart.price = inCart.product.price * inCart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)

    // Update cart
    this.total.quantity--
    this.total.price -= inCart.product.price
    this.total.formattedPrice = formatPrice(this.total.price)

    // Check if quantity is zero
    if(inCart.quantity < 1) {
      this.items = this.items.filter(item =>
        item.product.id != inCart.product.id)

      return this
    }

    return this
  },

  // === Delete Items
  delete(productId) {
    const inCart = this.getCartItem(productId)

    if(!inCart) return this

    if(this.items.length > 0) {
      this.total.quantity -= inCart.quantity
      this.total.price -= inCart.product.price * inCart.quantity
      this.total.formattedPrice = formatPrice(this.total.price)
    }

    this.items = this.items.filter(item => inCart.product.id != item.product.id)

    return this
  },

  getCartItem(productId) {
    return this.items.find(item => item.product.id == productId)
  }
}

module.exports = Cart