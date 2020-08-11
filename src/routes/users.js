const express = require('express');
const routes = express.Router();

//Controllers
const SessionController = require('../app/controllers/SessionController.js');
const UserController = require('../app/controllers/UserController');

//Validações antes de ir para a rota
const UserValidator = require('../app/validators/User');
const SessionValidator = require('../app/validators/Session');

//Verificações antes de ir pra rota
const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')

// === LOGIN / LOGOUT ===
/* isLoggedRedirectToUsers = verifica se o usuário esta logado, caso não esteja
ele é redirecionado para a tela de login se não vai para detalhes do usuário */
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm);

/* SessionValidator.login verifica se o email esta cadastrado e depois se a senha
esta correta, caso algum esteja errado a tela continuará a mesma, caso de certo
ele vai para tela de detalhes do usuário */
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// === RESET PASSWORD / FORGOT ===
routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

// === USER REGISTER ===
routes.get('/register', UserController.registerForm);
// UserValidator.post valida o formulário antes de salvar um novo usuário
routes.post('/register', UserValidator.post, UserController.post);

/* onlyUsers 
UserValidator.show verifica se o usuário existe, caso exista vai para tela de detalhes
caso não, vai para tela de registro
*/
routes.get('/', onlyUsers, UserValidator.show, UserController.show);
//UserValidator.update valida o formulário antes de atualizar um usuário
routes.put('/', UserValidator.update, UserController.update);
routes.delete('/', UserController.delete);

module.exports = routes;