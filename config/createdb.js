const Game = require("../models/game");
const Genre = require('../models/genre');
const Developer = require('../models/developer');
const Review = require('../models/review');
const User = require('../models/user')
const database = require('./database');

Game.belongsToMany(Genre, { through: 'GameGenres' });
Genre.belongsToMany(Game, { through: 'GameGenres' });

Game.belongsToMany(Developer, { through: 'GameDeveloper' });
Developer.belongsToMany(Game, { through: 'GameDeveloper' });

Game.hasMany(Review, { onDelete: 'CASCADE', foreignKey: 'gameId' });
Review.belongsTo(Game, { foreignKey: 'gameId' });

database.sync({ force: false }).then(() => {
    console.log('Database has synced');
}).catch(err => {
    console.error('error occured:', err);
});

module.exports = {Game, Genre, Developer, Review, User};