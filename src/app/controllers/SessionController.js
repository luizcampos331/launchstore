const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const User = require('../models/User')

module.exports = {
  loginForm(req, res) {
    return res.render('session/login.njk')
  },

  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect('/users')
  },

  logout(req, res) {
    req.session.destroy()

    return res.redirect('/')
  },

  forgotForm(req, res) {
    return res.render('session/forgot-password.njk')
  },

  resetForm(req, res) {
    return res.render('session/password-reset.njk', { token: req.query.token })
  },

  async forgot(req, res) {
    const user = req.user

    try {
      //um token para esse usuário
      const token = crypto.randomBytes(20).toString('hex')

      //criar uma expiração
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      await mailer.sendMail({
        to: user.email,
        from: 'no_reply@launchstore.com.br',
        subject: 'Recuperação de e-mail',
        html: `
          <h2>Perdeu a chave?</h2>
          <p>Não se preocupe, clique no link abaixo para recuperar sua chave</p>
          <p>
            <a href="http://localhost:5002/users/password-reset?token=${token}" taget="_blank">
              RECUPERAR SENHA
            </a>
          </p>
        `,
      })

      return res.render('session/forgot-password.njk', {
        success: 'Verifique seu email para trocar a sua senha!'
      })
    } catch(error) {
      console.error(error)
      return res.render('session/forgot-password.njk', {
        error: 'Erro inesperado, tente novamente!'
      })
    }
  },

  async reset(req, res) {
    const { password, token } = req.body
    const user = req.user

    try {
      //cria um novo hash de senha
      const newPassword = await hash(password, 8)

      //atualiza o usuário
      await User.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: '',
      })

      //avisa o usuário que ele tem uma nova senha
      return res.render('session/login.njk', {
        user: req.body,
        success: 'Senha atualizada! Faça o seu login.'
      })

    } catch(error) {
      console.error(error);

      return res.render('session/password-reset.njk', {
        user: req.body,
        token,
        error: 'Erro inesperado, tente novamente!'
      })
    }
  }
}