var db = require("../config/database.js");
const { post } = require("../routes/posts.js");
const postMiddleware = {}

postMiddleware.getRecentPosts = (req, res, next) => {
    let baseSQL = 'SELECT id,title,description,thumbnail, created FROM posts ORDER BY created DESC LIMIT 8';
    db.execute(baseSQL, [])
        .then(([results, fields]) => {
            res.locals.results = results;
            if (results && results.length == 0) {
                alert('error', 'There are no posts created yet');
            }
            next();
        })

        .catch((err) => next(err));

}


module.exports = postMiddleware;