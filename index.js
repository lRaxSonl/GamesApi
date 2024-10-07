const express = require('express');
const app = express();
const database = require('./config/database');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');


//Парсер для обработки JSON данных
app.use(bodyParser.json());

//Подключение маршрутов
require('./controllers/gameController')(app);
require('./routes/authRoute')(app);


const PORT = 5000;

database.authenticate()
  .then(() => {
    console.log('Соединение с базой данных установлено.');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к базе данных:', error);
  });