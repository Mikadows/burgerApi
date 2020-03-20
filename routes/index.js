const authRoutes = require('./auth.route');
const customerRoutes = require('./customer.route');
const preparerRoutes = require('./preparer.route');
const adminRoutes = require('./admin.routes');


module.exports = function(app) {
    authRoutes(app);
    customerRoutes(app);
    preparerRoutes(app);
    adminRoutes(app);
};
