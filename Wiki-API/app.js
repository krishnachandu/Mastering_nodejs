
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017'
mongoose.connect(url+"/wikiDB", {useNewUrlParser:true, useUnifiedTopology: true })
const app = express();

app.set('view engine', 'ejs');

const articleSchema = {
    title : String,
    content: String
}
let Article= new mongoose.model("Article",articleSchema)


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//TODO

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

app.route("/articles").get(function (req,res) {

    Article.find(function (err,result) {
        if(!err){
            res.send(result);
        }
        else{
            res.send(err);
        }

    })

}).post(function (req,response) {
    console.log(req.body);
    let article = new Article({"title" : req.body.title,
            "content":req.body.content
                })
    article.save(function (err,res) {
        if(!err){
            // log
            response.send(res)
        }

    })
}).delete(function (req,res) {
    console.log(req.params.articleName);
    Article.remove(function (err,response) {
        if(!err){
            res.send(response)
        }
        else {
            res.send(err)
        }


    });

});
app.route("/articles/:articleName").delete(function (req,res) {
    console.log(req.params.articleName);
    console.log(req.params)
    Article.deleteOne({"title":req.params.articleName},function(err,result){
        if(!err){
            res.send(result)
        }
        else
        {
            console.log('here')
            res.send(err);
        }
    })
}).get(function (req,res) {
    console.log(req.params.articleName);
    console.log(req.params)
    Article.findOne({"title":req.params.articleName},function(err,result){
        if(!err){
            res.send(result)
        }
        else
        {
            console.log('here');
            res.send("error");
        }
    })
}).put(function (req,res) {
    Article.update({"title":req.params.articleName},
        {"title":req.body.title,"content":req.body.content},
        {overwrite:true},function (err,result) {
        if(result){
            res.send(result)
        }
        else{
            res.send(err);
        }

    })
}).patch(function (req,res) {
    Article.update({"title":req.params.articleName},
        {$set:req.body},
        function (err,result) {
            if(!err){
                res.send("Updated successflly")
            }
            else{
                res.send(result);
            }
        }
        )

})