const { getUsers, updateUser } = require('../controllers/userConttoller');
const { authenticateToken } = require('../middlewares/middleware');

module.exports = function(app){
    //Получение всех пользователей
    app.get('/api/users', authenticateToken, getUsers);

    //Обновление информации о пользователе
    app.put('/api/upd/users/:id', authenticateToken, updateUser);
}
