var express = require('express');
var router = express.Router();
var db = require("../config/database.js");
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters.js');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError');
const { route } = require('./index.js');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("TESTING MULTER")//TESTING IGNORE
        cb(null, 'public/images/upload');
    },
    filename: (req, file, cb) => {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({ storage: storage });


router.post('/createPost', uploader.single("uploadImage"), (req, res, next) => {
    console.log('CREATE POST TESTING'); //TESTING ignore
    console.log(req);
    let title = req.body.title;
    let description = req.body.description;
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let forKey_userid = req.session.userId;
    console.log("TESTING CREATE POST DESCRIPTION") // TESTING IGNORE
    console.log(fileUploaded)
    console.log(destinationOfThumbnail)
    //console.log(title, description, fileUploaded, destinationOfThumbnail, forKey_userid);

    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            console.log("TESTING CREATE POST SQL") // TESTING IGNORE
            let baseSQL = "INSERT INTO posts (title, description, photopath, thumbnail, created, forKey_userid) VALUE (?,?,?,?, now(),?);";
            console.log(baseSQL); // TESTING IGNORE
            return db.execute(baseSQL, [title, description, "/" + fileUploaded, "/" + destinationOfThumbnail, forKey_userid]);

        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                console.log("TESTING REDIRECT POST JS")
                res.redirect('/index');
            } else {
                throw new PostError('Post could not be created!', '/postimage', 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL())
            } else {
                next(err);
            }
        })

});

router.get('/search')
module.exports = router;