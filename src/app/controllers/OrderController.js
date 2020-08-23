const LoadProductService = require('../service/LoadProductService')
const LoadOrderService = require('../service/LoadOrderService')
const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')

const email = (seller, product, buyer) => `
<h2> Olá ${seller.name}</h2>
<p>Você tem um novo pedido de compra do seu produto</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p><br/><br/></p>
<h3>Dados do comprador</h3>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.address} - ${buyer.cep}</p>
<p><br/></p>
<p><strong>Entre em contato com o comprador pra finalizar a venda!</strong></p>
<p>Atenciosamente, Equipe Launchstore</p>
`

module.exports = {
  async index(req, res) {
    const orders = await LoadOrderService.load('orders', {
      where: { buyer_id: req.session.userId }
    })
    
    return res.render('orders/index', { orders })
  },

  async sales(req, res) {
    const sales = await LoadOrderService.load('orders', {
      where: { seller_id: req.session.userId }
    })

    return res.render('orders/sales', { sales })
  },

  async show(req, res) {
    const order = await LoadOrderService.load('order', {
      where: { id: req.params.id }
    })

    return res.render('orders/details', { order })
  },
  
  async post(req, res) {
    try {
      // === Cart
      const cart = Cart.init(req.session.cart)

      // === Buyer
      const buyer_id = req.session.userId 
      const filteredItems = cart.items.filter(item => 
        item.product.user_id != buyer_id
      )

      // === Create Oeder - Send Order
      const createOrdersPromise = filteredItems.map(async item => {
        let { product, price: total, quantity } = item
        const { price, id: product_id, user_id: seller_id } = product
        const status = "open"

        // === Create Order
        const order = await Order.create({
          seller_id,
          buyer_id,
          product_id,
          price,
          total,
          quantity,
          status
        })

        // === Select Products
        product = await LoadProductService.load('product', { where: {
          id: product_id
        }})
        
        // === Select User - Vendedor
        const seller = await User.findOne({ where: { id: seller_id }})

        // === Select User - Comprador
        const buyer = await User.findOne({ where: { id: buyer_id }})

        // === Send Order
        await mailer.sendMail({
          to: seller.email,
          from: 'no-reply@launchstore.com.br',
          subject: 'Novo pedido de compra',
          html: email(seller, product, buyer)
        })

        return order
      })

      // === Run Promises
      await Promise.all(createOrdersPromise)

      // === Clean Cart
      delete req.session.cart
      Cart.init()

      // === End
      return res.render('orders/success')
      
    } catch(error) {
      console.log(error);
      return res.render('orders/error')
    }
  },

  async update(req, res ) {
    try {
      const { id, action } = req.params

      // === Check Action
      const acceptedActions = ['close', 'cancel']
      if(!acceptedActions.includes(action)) return res.send("Can't do this action")

      // === Select Order
      const order = await Order.findOne({
        where: { id }
      })
      
      // === Check if order exists
      if(!order) return res.send('Order not found')

      // === Check if open
      if(order.status != 'open') res.send("Can't do this action")

      // === Uptade Order
      const statuses = {
        close: 'sold',
        cancel: 'canceled'
      }

      order.status = statuses[action]

      await Order.update(id, {
        status: order.status
      })

      // === End
      return res.redirect('/orders/sales')

    } catch (error) {
      console.error(error)
    }
  }

}