var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    cookieParser    = require("cookie-parser"),
    flash           = require("connect-flash"),
    Entry           = require("./models/entry"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    expressSession  = require("express-session"),
    typeInit        = require("./typeInit"),
    methodOverride  = require("method-override"),

    //used for storing in mongodb
    connectMongo = require('connect-mongo'),
    MongoStore = connectMongo(expressSession);

    // configure dotenv
    require('dotenv').load();

//requiring routes
var commentRoutes   = require("./routes/comments"),
    entryRoutes     = require("./routes/entry"),
    indexRoutes     = require("./routes/index"),
    userRoutes      = require("./routes/users"),
    newEntryRoutes  = require("./routes/newEntry"),
    reviewRoutes    = require("./routes/reviews"),
    recRoutes       = require("./routes/recComments"),
    searchRoutes    = require("./routes/search"),
    config          = require("./config");


mongoose.connect(config.mongoUri);
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/bootstrap/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect JS for bootstrap
app.use('/bootstrap/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS for bootstrap
app.use('/select2/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect JS for select2
app.use('/select2/css', express.static(__dirname + '/node_modules/select2/dist/css')); // redirect CSS for select2


app.use(methodOverride('_method'));

app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');

//init all type objects
typeInit();


// PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "We spent too much time on this!",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
           mongooseConnection: mongoose.connection 
        })
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

//url routing
app.use("/", indexRoutes);
app.use("/entry", entryRoutes);
app.use("/users", userRoutes);
app.use("/new-entry", newEntryRoutes);
//app.use("/entry/:id/comments", commentRoutes);
app.use("/entry/:id/reviews", reviewRoutes);
app.use("/entry/:id/recommendations", recRoutes);
app.use("/search", searchRoutes);

//port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});