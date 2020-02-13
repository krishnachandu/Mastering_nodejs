//jshint esversion:6
const express=require("express")
const app=express()
app.get("/", function (request,response) {
    console.log(request);
    console.log(request);
    response.send("<h1> Hello World </h1>");
})
app.listen(3000,function () {
console.log("Hello started");
});

app.get("/contact", function (req,res) {
    res.send("My contact num :4805066039");

})


app.get("/about", function (req,res) {
    res.send("I am student ast Arizona State University");

})




app.get("/hobbies", function (req,res) {
    res.send("Coffee, badminton");

})
