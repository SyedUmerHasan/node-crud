import * as router from "express";

let Article = require("./models/articles");
router.get("/article/:id",function (req,res) {
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
router.post("/articles/add",function (req, res) {
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
router.get("/addArticles",function (req,res) {
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
router.get("/article/edit/:id",function (req,res) {
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
router.post("/editArticles",function (req,res) {
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
router.get("/article/delete/:id",function (req,res) {
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

module.exports= router;