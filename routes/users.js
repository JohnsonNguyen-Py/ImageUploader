var express = require('express');
var router = express.Router();
var db = require("../config/database.js");
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters.js');
var bcrypt = require('bcrypt');
var UserError = require("../helpers//error/UserError.js");

/* GET users listing. 
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
*/

router.post('/register', (req, res, next) => {
  //console.log("post Register")
  let username = req.body.Username;
  let password = req.body.Password;
  let email = req.body.Email;
  let con_Pw = req.body.Password;
  //console.log("test")
  //console.log(username)

  db.execute("SELECT * FROM users WHERE username =?", [username])
    .then(([results, fields]) => {
      console.log("Execute 1"); // testing ignore
      if (results && results.length == 0) {
        return db.execute("SELECT * FROM users WHERE email =?", [email])
      } else {
        throw new UserError(
          "Registration failed: Username already exists"
        )
        "/registration", 200
      }
    })
    .then(([results, fields]) => {
      if (results && results.length == 0) {
        return bcrypt.hash(password, 13);
      } else {
        throw new UserError(
          "Registration failed: Email already exists"
        )
        "/registration", 200
      }
    }) //BCRYPT


    .then((hashedPassword) => {
      console.log("Execute 2"); // testing ignore
      console.log(password, email, username); // testing ignore

      let baseSQL = "INSERT INTO users(username, email, password, created) VALUES (?,?,?,now());"
      return db.execute(baseSQL, [username, email, hashedPassword]);
    })
    .then(([results, fields]) => {
      console.log("Execute 3"); // testing ignore
      console.log(results);  // testing ignore
      if (results && results.affectedRows) {
        successPrint("User.js --> User was created!");
        res.redirect("/login");
      } else {
        throw new UserError(
          "Server Error, User not be created",
          "/registration",
          500
        );
      }
    })
    .catch((err) => {
      errorPrint("User could not made", err);
      next(err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURl());
      } else {
        next(err);
      }
    });
});

router.post('/login', (req, res, next) => {
  //console.log(req.body)// TEST SUBJECTS
  // res.send(req.body) //TEST SUBJECTS
  let Username = req.body.Username;
  let Password = req.body.Password;

  /**
  * do server side validation ere
  * 
  */

  let baseSQL = "SELECT id,username, password FROM users WHERE username=?;"
  let userId;
  db.execute(baseSQL, [Username])
    .then(([results, fields]) => {
      if (results && results.length == 1) {
        let hashedPassword = results[0].password;
        userId = results[0].id;
        console.log(hashedPassword); //TESTING IGNORE
        return bcrypt.compare(Password, hashedPassword);
      } else {
        throw new UserError("Invalid username and/or password", "/login", 200);
      }
    })
    .then((PasswordsMatched) => {
      if (PasswordsMatched) {
        successPrint(`User ${Username} is logged in`);
        req.session.username = Username;
        req.session.userId = userId;
        res.locals.logged = true;
        res.redirect('/postimage');
      } else {
        throw new UserError("Invalid username and/or password", "/login", 200);
      }
    })
    .catch((err) => {
      errorPrint("user login failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        res.status(err.getStatus());
        res.redirect('/login');
      } else {
        next(err);
      }
    })

});

router.post('/logout', (req, res, next) => {
  console.log("logout test")
  req.session.destroy((err) => {
    if (err) {
      console.log("testing session err");
      errorPrint('Session could not be destroyed');
      //next(err);
    } else {
      successPrint('session is destroyed. Goodbye');
      res.clearCookie('csid');
      console.log('test session');
      //res.json({ status: "ok", message: "user logged out" });
    }
  })
});

module.exports = router;

