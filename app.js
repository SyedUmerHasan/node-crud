const express  =  require("express");
const path =  require("path");
const mongoose = require('mongoose');
// Mongoose connection with database using localhost
mongoose.connect('mongodb://localhost/nodecrud');
const app = express();

// Creating DB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We are connected");
    // we're connected!
});
//Calling Models variables
let Article = require("./models/articles");

// Load View Engine
app.set("views",path.join(__dirname,"views"));
app.set("view engine","pug");

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
    }) ;
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

app.listen("3000",function (error) {
    console.log("Server started on 3000");
});