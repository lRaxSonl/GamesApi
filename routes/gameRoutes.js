const {
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
} = require('../controllers/gameControllers');
const { authenticateToken, isAdmin } = require('../middlewares/middleware');

module.exports = function(app){
    //Получение списка всех видеоигр
    app.get('/api/games', getAllGames);

    //Поиск игр по названию
    app.get('/api/games/search', searchGames);

    //Фильтрация игр по году выпуска
    app.get('/api/games/filter', filterGamesByReleaseYear);

    //Сортировка игр по любому полю
    app.get('/api/games/sort', sortGames);

    //Получение списка самых популярных игр
    app.get('/api/games/statistics/popular', getPopularGames);

    //Получение игр с наибольшим количеством обзоров
    app.get('/api/games/statistics/reviews', getMostReviewedGames);

    //Получение информации об игре по её ID
    app.get('/api/games/:id', getGameById);

    //Добавление новой игры
    app.post('/api/add/games', authenticateToken, isAdmin, addGame);

    //Обновление информации об игре по её ID
    app.put('/api/upd/games/:id', authenticateToken, isAdmin, updateGame);

    //Удаление игры по её ID
    app.delete('/api/del/games/:id', authenticateToken, isAdmin, deleteGame);

    // Добавление комментария к игре
    app.post('/api/games/:gameId/comments', authenticateToken, addCommentToGame);
}
