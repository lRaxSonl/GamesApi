const { authenticateToken, isAdmin } = require('../middlewares/middleware')


module.exports = function(app){

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/', authenticateToken, (req, res) => {
        res.render('index');
    });
    
}