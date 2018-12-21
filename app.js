const express  =  require("express");
const path =  require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
// Mongoose connection with database using localhost
mongoose.connect('mongodb://localhost/nodecrud');
const app = express();

// create application/json parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//Calling Models variables
let Article = require("./models/articles");

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
    let query = {_id : req.params.id};
    Article.update(query,article,function (error) {
        if(error){
            console.log(error);
        }
        else {
            console.log("Data Added");
            res.redirect("/");
        }
    })
});


app.listen("3000",function (error) {
    console.log("Server started on 3000");
});