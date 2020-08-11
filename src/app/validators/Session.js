const User = require('../models/User');
const { compare } = require('bcryptjs');

async function login(req, res, next) {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: {email} })

    if(!user) return res.render('session/login.njk', {
      user: req.body,
      error: "Usuário não cadastrado!"
    })
  
    const passed = await compare(password, user.password)
  
    if(!passed) return res.render('session/login.njk', {
      user: req.body,
      error: 'Senha incorreta.'
    })
  
    req.user = user
    
    next()
  } catch(error) {
    console.error(error)
  }
}

async function forgot(req, res, next) {
  const { email } = req.body

  try {
    let user = await User.findOne({ where: { email }})

    if(!user) return res.render('session/forgot-password', {
      user: req.body,
      error: 'E-mail não cadastrado'
    })

    req.user = user

    next()
  } catch(error) {
    console.error(error)
  }

}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body

  try {
    //procurar o usuário
    const user = await User.findOne({ where: {email} })

    if(!user) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: "Usuário não cadastrado!"
    })
    
    //Verificar se a senha bate
    if(password != passwordRepeat) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Senha e repetição da senha são diferentes!'
    });

    //verificar se o token bate
    if(token != user.reset_token) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Token inválido! Solicite uma nova recuperação de senha.'
    })

    //verificar se o token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Token expirado! Solicite uma nova recuperação de senha.'
    })

    req.user = user

    next()
    
  } catch(error) {
    console.error(error)
  }
}

module.exports = {
  login,
  forgot,
  reset
}