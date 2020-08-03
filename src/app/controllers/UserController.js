const User = require('../models/User.js');
module.exports = {
  async registerForm(req, res) {
    return res.render('user/register.njk');
  },

  async show(req, res) {
    return res.send('Cadastrado!');
  },

  async post(req, res) {
    const userId = await User.create(req.body);

    return res.redirect('/users');
  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}