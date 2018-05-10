var express = require("express");
var router  = express.Router();

//root route
router.get("/", function(req, res){
    res.redirect("/search");
});

router.get('/register', function(req, res) {

    res.redirect('/users/register');
});

router.get('/login', function(req, res) {

    res.redirect('/users/login');
});

router.get('/logout', function(req, res) {

    res.redirect('/users/logout');
});

module.exports = router;
