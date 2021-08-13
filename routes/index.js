var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeproectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postMiddleware').getRecentPosts;
var db = require("../config/database.js");

/* GET home page. */
// / --> localhost:3000


router.get('/', getRecentPosts, function (req, res, next) {
  res.render('login', { title: "IPa APP", search: true, results: res.locals.results });
});

router.get('/login', (req, res, next) => {
  res.render("login", { title: "Log in", search: true });
})

router.get('/registration', (req, res, next) => {
  res.render("registration", { title: "Register", search: true });
})

router.get('/postimage', isLoggedIn, (req, res, next) => {
  res.render("postimage", { title: "Post an Image" });
})

router.get('/index', getRecentPosts, (req, res, next) => {
  res.render("index", { title: "Image Post", search: true, results: res.locals.results });
})

router.get('/post/:id(\\d+)', (req, res, next) => {
  let baseSQL = "SELECT u.id, u.username, p.title, p.description, p.thumbnail, p.created \
  FROM users u \
  JOIN posts p ON u.id = forKey_userid \
  WHERE p.id = ? ; ";


  let postId = req.params.id;
  req.session.viewing = req.params.id;
  db.execute(baseSQL, [postId])
    .then(([results, fields]) => {
      if (results && results.length) {
        let post = results[0];
        console.log(post);
        console.log("TESTING POST ID"); //TESTING IGNORE
        res.render('imagepost', { data: post })
      } else {
        alert('error, this is not the post you are looking for');
        res.redirect('/');
      }
    })


})








router.post("/search", async (req, res) => {
  let search = req.body;

  if (!req.body.search) {
    res.send({
      resultStatus: "info",
      message: "No search term given",
      results: [],
    })
  } else {
    let baseSQL =
      "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack FROM posts HAVING haystack like ?;";
    let sqlready = "%" + req.body.search + "%";

    let [r, fields] = await db.execute(baseSQL, [sqlready]);

    if (r && r.length) {
      res.render("index", {
        results: r,
        title: "woah",
        search: true,
      });
    } else {
      let [r2, fields] = await db.query(
        "SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 8",
        []
      );
      res.send({
        resultStatus: "info",
        message:
          "No Results were found for your search but here are the 8 most recent posts",
        results: r2,
      });
    }
  }



})

router.post("/comment", (req, res) => {
  let comment = req.body.comment;
  let postid = req.session.viewing;
  let forKey_userid = req.session.userId
  let baseSQL =
    "INSERT INTO comments (description,forKey_postid,forKey_userid,created) VALUES (?,?,?,now());";
  //console.log("TESTING COMMENTS") // TESTING IGNORE
  db.execute(baseSQL, [comment, postid, forKey_userid]);
  console.log(comment); //TESTING IGNORE
  res.redirect('/post/' + postid);

})

module.exports = router;


