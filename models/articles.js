let mongoose = require("mongoose");

// Article Schema
var ArticleSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    author:{
        type : String,
        required : true
    },
    body:{
        type : String,
        required : true
    }
});
// var Article = mongoose.model('Article', ArticleSchema);
let Articles =  module.exports = mongoose.model('Article', ArticleSchema);
