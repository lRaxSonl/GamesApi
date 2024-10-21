const { registerUser, loginUser } = require('../controllers/authControllers');

module.exports = function(app){
    //Регистрация пользователя
    app.post('/api/register', registerUser);

    //Авторизация пользователя
    app.post('/api/login', loginUser);
}
