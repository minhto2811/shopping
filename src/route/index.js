const users = require('./user.route')

function route(app) {
    app.get('/', (req, res) => {
        res.send('Hey this is my API running 🥳')
    });
    app.use('/api/user', users)

}

module.exports = route