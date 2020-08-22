const { unlinkSync } = require('fs')
const { hash } =require('bcryptjs')

const User = require('../models/User.js');
const Product = require('../models/Product.js');
const LoadProductService = require('../service/LoadProductService');

const { formatCep , formatCpfCnpj } = require('../../lib/utils');

module.exports = {
  async registerForm(req, res) {

    return res.render('user/register.njk');
  },

  async show(req, res) {
    try {
      const { user } = req;

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
      user.cep = formatCep(user.cep)
  
      return res.render('user/index.njk', { user });
      
    } catch (error) {
      console.error(error)
    }
  },

  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj, cep, address } = req.body

      password = await hash(password, 8);
      cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
      cep = cep.replace(/\D/g, '')

      const userId = await User.create({
        name, 
        email, 
        password, 
        cpf_cnpj, 
        cep, 
        address
      });
  
      //Adicionado a chave userId na sessão com o valor de "userId"
      req.session.userId = userId;
  
      return res.redirect('/users');
      
    } catch (error) {
      console.error(error)
    }
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
      const products = await Product.findAll({ where: { user_id: req.body.id }})

      const allFilesPromise = products.map(product => Product.files(product.id))
      let promiseResults = await Promise.all(allFilesPromise)

      await User.delete(req.body.id)
      req.session.destroy()

      promiseResults.map(files => {
        files.map(file => {
          try {
            unlinkSync(file.path)
          } catch (error) {
            console.error(error)
          }
        })
      })
      
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
  },

  async ads(req, res) {
    const products = await LoadProductService.load('products', {
      where: { user_id: req.session.userId }
    })

    return res.render('user/ads', { products })
  }
}