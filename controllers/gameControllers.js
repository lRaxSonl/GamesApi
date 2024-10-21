const { Game, Genre, Review } = require('../config/createdb');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

//Получение списка всех видеоигр.
const getAllGames = async (req, res) => {
    try {
        const games = await Game.findAll();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении игр' });
    }
};

//Поиск игр по названию.
const searchGames = async (req, res) => {
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

            case 'rating':
                games = await Game.findAll({
                    where: {
                        rating: { [Op.gte]: value }
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
};

//Фильтрация игр по году выпуска.
const filterGamesByReleaseYear = async (req, res) => {
    const { releaseYear } = req.query;
    try {
        const games = await Game.findAll({
            where: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('release_date')), releaseYear)
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при фильтрации игр по году выпуска' });
    }
};

//Сортировка игр по любому полю.
const sortGames = async (req, res) => {
    const { field, order } = req.query;
    try {
        const games = await Game.findAll({
            order: [[field, order.toUpperCase()]]
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при сортировке игр' });
    }
};

//Получение списка самых популярных игр.
const getPopularGames = async (req, res) => {
    try {
        const games = await Game.findAll({
            order: [['plays', 'DESC']]
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении популярных игр' });
    }
};

//Получение игр с наибольшим количеством обзоров.
const getMostReviewedGames = async (req, res) => {
    try {
        const games = await Game.findAll({
            order: [['number_of_reviews', 'DESC']]
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении игр с наибольшим количеством обзоров' });
    }
};

//Получение информации об игре по её ID.
const getGameById = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id, {
            include: [
                {
                    model: Review,
                    as: 'Reviews',
                    attributes: ['id', 'userId', 'text']
                }
            ]
        });

        if (game) {
            res.json(game);
        } else {
            res.status(404).json({ error: 'Игра не найдена' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении информации об игре', details: error.message });
        console.log(error);
    }
};

//Добавление новой игры.
const addGame = async (req, res) => {
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
};

//Обновление информации об игре по её ID.
const updateGame = async (req, res) => {
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
};

//Удаление игры по её ID.
const deleteGame = async (req, res) => {
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
};

// Добавление комментария к игре.
const addCommentToGame = async (req, res) => {
    try {
        const { text } = req.body;
        const gameId = req.params.gameId;

        const game = await Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Игра не найдена' });
        }

        const review = await Review.create({
            text,
            gameId,
            userId: req.user.id
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при добавлении комментария' });
    }
};

module.exports = {
    getAllGames,
    searchGames,
    filterGamesByReleaseYear,
    sortGames,
    getPopularGames,
    getMostReviewedGames,
    getGameById,
    addGame,
    updateGame,
    deleteGame,
    addCommentToGame
};
