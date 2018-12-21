const express  =  require("express");
const app = express();

app.get("/",function (req,res) {
    res.send("syed uemr hasan");
});

app.listen("3000",function (error) {
    if(!error){
        console.log("Server started on 3000");
    }
});