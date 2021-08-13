const { successPrint, errorPrint } = require('../helpers/debug/debugprinters.js');
const routeProtectors = {};
routeProtectors.userIsLoggedIn = (req, res, next) => {
    if (req.session.username) {
        successPrint('User is logged in');
        next();
    } else {
        errorPrint('user must be logged in to create a post!');
        res.redirect('/login');
    }
}


module.exports = routeProtectors;