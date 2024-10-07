const readCsv = require("./readCsv");
const { Game, Genre, Developer, Review } = require('./config/createdb');
const database = require("./config/database");


/*
//Вывести название
readCsv().then((data) => {
    data.forEach((game, i) => {
        console.log(JSON.parse(game)['Title']);
    });
});
*/


async function saveGameToDatabase(gameData) {
    try {
        //Создание игры
        const game = await Game.create({
            name: gameData["Title"],
            release_date: new Date(gameData["Release Date"]),
            rating: gameData["Rating"],
            number_of_reviews: gameData["Number of Reviews"],
            summary: gameData["Summary"],
            plays: gameData["Plays"],
            playing: gameData["Playing"],
            backlogs: gameData["Backlogs"],
            wishlist: gameData["Wishlist"]
        });

        //Создание жанров
        const genres = gameData["Genres"].split(',').map(g => g.trim());
        const genreInstances = await Promise.all(genres.map(async (genreName) => {
            const [genre] = await Genre.findOrCreate({ where: { name: genreName } });
            return genre;
        }));
        await game.addGenre(genreInstances);

        //Создание разработчиков
        const developers = gameData["Team"].split(',').map(dev => dev.trim());
        const developerInstances = await Promise.all(developers.map(async (developerName) => {
            const [developer] = await Developer.findOrCreate({ where: { name: developerName } });
            return developer;
        }));
        await game.setDevelopers(developerInstances);

        //Создание отзывов
        const reviews = gameData["Reviews"];
        if (reviews) {
            const reviewTexts = reviews.split(',').map(review => review.trim());
            for (const reviewText of reviewTexts) {
                if (reviewText) {
                    await Review.create({ text: reviewText, gameId: game.id });
                }
            }
        }

        console.log(`Игра "${game.name}" успешно сохранена в базу данных.`);
    } catch (error) {
        console.error('Ошибка при сохранении игры в базу данных:', error);
    }
}

//Чтение CSV
readCsv().then(async (games) => {
    for (const gameData of games) {
        await saveGameToDatabase(JSON.parse(gameData));
    }
}).catch(err => {
    console.error('Ошибка при чтении CSV:', err);
});
