const User = require('../models/User.js');
const { formatCep , formatCpfCnpj } = require('../../lib/utils');

module.exports = {
  async registerForm(req, res) {

    return res.render('user/register.njk');
  },

  async show(req, res) {
    const { user } = req;
    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
    user.cep = formatCep(user.cep)

    return res.render('user/index.njk', { user });
  },

  async post(req, res) {
    const userId = await User.create(req.body);

    //Adicionado a chave userId na sessão com o valor de "userId"
    req.session.userId = userId;

    return res.redirect('/users');
  },

  async update(req, res) {
    try {
      const { user } = req
      let { name, email, cpf_cnpj, cep, address } = req.body
      cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
      cep = cep.replace(/\D/g, '')

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      })

      return res.render('user/index.njk', {
        user: req.body,
        success: 'Conta atualizada com sucesso!'
      })

    } catch(error) {
      console.log(error)
      return res.render('user/index.njk', {
        error: 'Algum erro aconteceu.'
      })
    }
  },

  async delete(req, res) {
    try {
      await User.delete(req.body.id)
      req.session.destroy()

      return res.render('session/login.njk', {
        success: 'Conta deletada com sucesso!'
      })

    } catch(error) {
      console.error(error)
      return res.render('user/index.njk', {
        user: req.body,
        error: 'Erro ao deletar sua conta!'
      })
    }
  }
}