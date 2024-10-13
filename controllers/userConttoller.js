const { User } = require('../config/createdb');
const { authenticateToken } = require('../middlewares/middleware')

module.exports = function(app){

    app.get('/api/users', authenticateToken, async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email']
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении пользователей.' });
        }
    });

    app.put('/api/upd/users/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { name, email, password } = req.body;
    
        if (req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Вы можете редактировать только свой профиль.' });
        }
    
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }
    
            if (name) user.name = name;
            if (email) user.email = email;
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }
    
            await user.save();
            res.json({ message: 'Информация обновлена успешно.', user: { id: user.id, name: user.name, email: user.email } });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении информации.', details: error.message });
            console.log(error)
        }
    });
}