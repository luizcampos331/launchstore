const { formatPrice, date } = require('../../lib/utils');
const Order = require('../models/Order');
const User = require('../models/User');
const LoadProductService = require('./LoadProductService')

async function format(order) {
  // Product
  order.product = await LoadProductService.load('productWithDeleted', {
    where: { id: order.product_id }
  })

  //Buyer
  order.buyer = await User.findOne({
    where: { id: order.buyer_id}
  })

  // Seller
  order.seller = await User.findOne({
    where: { id: order.seller_id}
  })

  // Price - Total
  order.formattedPrice = formatPrice(order.price)
  order.formattedTotal = formatPrice(order.total)

  // Status
  const statuses = {
    open: 'Aberto',
    sold: 'Vendido',
    canceled: 'Cancelado'
  }
  order.formattedStatus = statuses[order.status]

  // Date update
  const updatedAt = date(order.updated_at)
  order.formattedUpdatedAt = `
    ${order.formattedStatus} em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} as ${updatedAt.hour}:${updatedAt.minute}
  `

  return order
}

const LoadService = {
  load(service, filter) {
    this.filter = filter
    return this[service]()
  },

  async order() {
    try {
      const order = await Order.findOne(this.filter)
      return format(order)
    } catch (error) {
      console.error(error)
    }
  },

  async orders() {
    try {
      // === Select Order
      const orders = await Order.findAll(this.filter)
      const ordersPromise = orders.map(format)
      return Promise.all(ordersPromise)
      
    } catch (error) {
      console.error(error)
    }
  },

  format
}

module.exports = LoadService