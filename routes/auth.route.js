const bodyParser = require('body-parser');

module.exports = function(app) {

    app.post('/auth/subscribe', bodyParser.json(), async (req, res) => {
        res.status(501).end();
    });

    app.post('/auth/login', bodyParser.json(), async (req, res) => {
        res.status(501).end();
    });

    app.delete('/auth/logout', async (req, res) => {
        res.status(501).end();
    });


};
