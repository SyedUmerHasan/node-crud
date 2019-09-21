const express  =  require("express");
const path =  require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var flash = require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator');

// Mongoose connection with database using localhost
mongoose.connect('mongodb://localhost/nodecrud');
const app = express();

// create application/json parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//Calling Models variables
let Article = require("./models/articles");

//Express session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}))
var sess = {
    secret: 'keyboard cat',
    cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));
// Flash Messages middleware

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value, location) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length){
            formParam+=  "[" + namespace.shift() + "]";
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));
// app.use(express.cookieParser('keyboard cat'));
// app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//Set Public Folder
app.use(express.static(path.join(__dirname,"public")));
//Setting View Folder
app.set("views",path.join(__dirname,"views"));
// Load View Engine
app.set("view engine","pug");

// Creating DB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We are connected");
    // we're connected!
});
//Routes
app.get("/",function (req,res) {
    var blog = [
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        },
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        },
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        },
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        }
    ];
    // Finding all Articles from Database using MongoDB
    Article.find(function (err, article) {
        if (err) return console.error(err);
            let title = "Home Page";
            res.render("index",{
                blog : blog,
                title : title,
                articles : article
            });
    });
});
app.get("/article/:id",function (req,res) {
    // res.send(req.params.id);
    Article.findById(req.params.id,function (error,article) {
        if (error){
            console.log(error);
        }
        else {
            console.log(article)
            res.render("show_articles",{
                articles : article
            });
        }
    });
});
app.post("/articles/add",function (req, res) {
    req.checkBody("BlogName" , "Blog Name is required").notEmpty();
    req.checkBody("AuthorName" , "Author Name is required").notEmpty();
    req.checkBody("BlogContent" , "Blog Body is required").notEmpty();

    let errors = req.validationErrors();
    // var article = {};
    //     article.title = req.body.BlogName;
    //     article.author = req.body.AuthorName;
    //     article.body = req.body.BlogConten;

    if(errors){
        res.render("edit_articles",{
            errors:errors,
            title : "Add Blog"
        });
    }
    let article = new Article();
    article.title = req.body.BlogName;
    article.author = req.body.AuthorName;
    article.body = req.body.BlogContent;
    article.save(function (error) {
        if(error)
        {
            console.log(error);
            return;
        }
        else {
            console.log("Data added");
            req.flash("success", "Article Added");
            res.redirect("/");
        }
    });
    // console.log(req.body);
    // if (!req.body) return res.sendStatus(400)
    // res.send('welcome, ' + req.body.AuthorName)
});
app.get("/addArticles",function (req,res) {
    var blog = [
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        },
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        },
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        },
        {
            "title" : "Blog one",
            "author" : "Syed Umer Hasan",
            "description" : "This is my description"
        }
    ];
    var title = "Add Blogs";
    res.render("add_articles",{
        blog : blog,
        title : title
     });
    console.log("Blog Created");
});
app.get("/article/edit/:id",function (req,res) {
    Article.findById(req.params.id,function (error,article) {
        if (error){
            console.log(error);
        }
        else {
            console.log(article)
            res.render("edit_articles",{
                articles : article
            });
        }
    });
});
app.post("/editArticles",function (req,res) {
    let article = {};
    article.title = req.body.BlogName;
    article.author = req.body.AuthorName;
    article.body = req.body.BlogContent;
    let query = {_id : req.body.BlogID};
    console.log(article);
    Article.update(query,article,function (error) {
        if(error){
            console.log(error);
        }
        else {
            console.log("Data Added");
            res.redirect("/");
        }
    });
});
app.get("/article/delete/:id",function (req,res) {
    let query = {_id : req.params.id};
    Article.remove(query,function (error) {
        if(error){
            console.log("Error in deleting");
        }
        else {
            console.log("Deleted");
            res.redirect("/");
        }
    })
});

app.listen("3000",function (error) {
    console.log("Server started on 3000");
});