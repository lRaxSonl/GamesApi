const { Game, Genre, Developer, Review } = require('../config/createdb');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');


module.exports = function(app) {


    //Получение списка всех видеоигр.
    app.get('/api/games', async (req, res) => {
        try {
            const games = await Game.findAll();
            res.json(games);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении игр' });
        }
    });



    //Поиск игр по названию.
    app.get('/api/games/search', async (req, res) => {
        const { type, value } = req.query;
        try {
            let games;
    
            switch (type) {
                case 'title':
                    games = await Game.findAll({
                        where: {
                            name: { [Op.like]: `%${value}%` }
                        }
                    });
                    break;
    
                case 'genre':
                    games = await Game.findAll({
                        include: {
                            model: Genre,
                            where: { name: value }
                        }
                    });
                    break;
    
                case 'rating': //Поиск по рейтингу
                    games = await Game.findAll({
                        where: {
                            rating: { [Op.gte]: value } //Рейтинг больше или равен указанному
                        }
                    });
                    break;
    
                default:
                    return res.status(400).json({ error: 'Некорректный тип поиска.' });
            }
    
            if (games.length === 0) {
                return res.status(404).json({ error: 'Игры не найдены' });
            }
    
            res.json(games);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при поиске игр' });
        }
    });



    //Фильтрация игр по году выпуска.
    app.get('/api/games/filter', async (req, res) => {
        const { releaseYear } = req.query;
        try {
            const games = await Game.findAll({
                where: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('release_date')), releaseYear)
            });
            res.json(games);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при фильтрации игр по году выпуска' });
        }
    });



    //Сортировка игр по любому полю.
    app.get('/api/games/sort', async (req, res) => {
        const { field, order } = req.query;
        try {
            const games = await Game.findAll({
                order: [[field, order.toUpperCase()]]
            });
            res.json(games);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при сортировке игр' });
        }
    });



    //Получение списка самых популярных игр.
    app.get('/api/games/statistics/popular', async (req, res) => {
        try {
            const games = await Game.findAll({
                order: [['plays', 'DESC']]
            });
            res.json(games);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении популярных игр' });
        }
    });



    //Получение игр с наибольшим количеством обзоров.
    app.get('/api/games/statistics/reviews', async (req, res) => {
        try {
            const games = await Game.findAll({
                order: [['number_of_reviews', 'DESC']]
            });
            res.json(games);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении игр с наибольшим количеством обзоров' });
        }
    });



    //Получение информации об игре по её ID.
    app.get('/api/games/:id', async (req, res) => {
        try {
            const game = await Game.findByPk(req.params.id);
            if (game) {
                res.json(game);
            } else {
                res.status(404).json({ error: 'Игра не найдена' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении информации об игре' });
        }
    });



    //Добавление новой игры.
    app.post('/api/add/games', async (req, res) => {
        try {
            const { title, releaseDate, team, rating, genres, summary } = req.body;
            
            if (!Array.isArray(genres)) {
                return res.status(400).json({ error: 'Жанры должны быть массивом' });
            }
    
            const game = await Game.create({
                name: title,
                release_date: releaseDate,
                team: team,
                rating: rating,
                summary: summary
            });
    
            //Создание жанров
            const genreInstances = await Promise.all(genres.map(async genreName => {
                const [genre] = await Genre.findOrCreate({ where: { name: genreName } });
                return genre;
            }));
    
            //Добавление жанров к игре
            await game.addGenres(genreInstances);
    
            res.status(201).json(game);
        } catch (error) {
            console.error('Ошибка при создании игры:', error);
            res.status(500).json({ error: 'Ошибка при создании игры' });
        }
    });



    //Обновление информации об игре по её ID.
    app.put('/api/upd/games/:id', async (req, res) => {
        try {
            const game = await Game.findByPk(req.params.id);
            if (!game) {
                return res.status(404).json({ error: 'Игра не найдена' });
            }

            const { title, releaseDate, team, rating, genres, summary } = req.body;

            await game.update({
                name: title,
                release_date: releaseDate,
                team: team,
                rating: rating,
                summary: summary
            });

            const genreInstances = await Promise.all(genres.map(async genreName => {
                const [genre] = await Genre.findOrCreate({ where: { name: genreName } });
                return genre;
            }));
            await game.setGenres(genreInstances);

            res.json(game);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении игры' });
        }
    });



    //Удаление игры по её ID.
    app.delete('/api/del/games/:id', async (req, res) => {
        try {
            const game = await Game.findByPk(req.params.id);
            if (!game) {
                return res.status(404).json({ error: 'Игра не найдена' });
            }
            await game.destroy();
            res.json({ message: 'Игра успешно удалена' });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении игры' });
        }
    });
}