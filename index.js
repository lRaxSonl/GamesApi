const express = require('express');
const app = express();
const database = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');

//Парсер для обработки JSON данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Подключение контроллеров
require('./controllers/gameControllers')(app);
require('./controllers/authControllers')(app);
require('./controllers/userConttoller')(app)


//Подключение маршрутов
require('./routes/routes')(app);

app.set('view engine', 'ejs'); //Устанавливаем EJS как шаблонизатор
app.set('views', path.join(__dirname, 'templates'));

const PORT = 5000;

database.authenticate()
  .then(() => {
    console.log('Соединение с базой данных установлено.');
    app.listen(PORT, () => {
      console.log(`Сервер запущен по адресу 127.0.0.1:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к базе данных:', error);
  });
