const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/createdb');
const JWT_SECRET = require('../config/config')

module.exports = function(app) {



    //Регистрация пользователя
    app.post('/api/register', async (req, res) => {
        const { name, email, password } = req.body;

        try {


            if(!name || !email || !password) {
                return res.status(400).json({ message: 'Все поля обязательны' });
            }

            //Проверка, существует ли пользователь
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }

            //Хэширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);


            const newUser = await User.create({
                name,
                email,
                password: hashedPassword
            });

            //Генерация JWT токена
            const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ token });
        } catch (error) {
            console.log('Ошибка при регистрации:', error);
            res.status(500).json({ error: 'Ошибка при регистрации', details: error.message });
            
        }
    });

    //Логин пользователя
    app.post('/api/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            //Проверка пользователя в базе данных
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: 'Неверный email или пароль' });
            }

            //Проверка пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный email или пароль' });
            }

            //Генерация JWT токена
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

            res.json({ token });

            
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при авторизации', details: error.message });
            console.log(error)
        }
    });
}