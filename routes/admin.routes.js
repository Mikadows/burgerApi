module.exports = function(app) {

    /**
     * Product management
     */

    app.post('/manage/product', async (req, res) => {
        //TODO : Create product
        res.status(501).end();
    });

    app.update('/manage/product/:id', async (req, res) => {
        //TODO : Update product
        res.status(501).end();
    });

    app.delete('/manage/product/:id', async (req, res) => {
        //TODO : Delete product
        res.status(501).end();
    });

    /**
     * Menu management
     */

    app.post('/manage/menu', async (req, res) => {
        //TODO : Create product
        res.status(501).end();
    });

    app.update('/manage/menu/:id', async (req, res) => {
        //TODO : Update product
        res.status(501).end();
    });

    app.delete('/manage/menu/:id', async (req, res) => {
        //TODO : Delete product
        res.status(501).end();
    });

};
