const express=require("express")
const bodyParser = require("body-parser");
const app =express()
app.use(bodyParser.urlencoded({extended:true}))
app.get("/", function (req,res) {
    res.sendFile(__dirname+"/index.html");
    // console.log(__dirname)

})
app.get("/bmiCalculator", function (req,res) {
    res.sendFile(__dirname+"/bmiCalculator.html");
    // console.log(__dirname)

})
app.listen(3000,function (request,response) {

    console.log("server started");
})

app.post("/", function (req,res) {
    res.send("Result is "+(parseInt(req.body.num1)+parseInt(req.body.num2)));
    console.log(req.body);
    // res.
    //
    // send("thanks")

}
)
app.post("/bmicalculator",function (req, res) {
    var weight=req.body.weight;
    var height=req.body.height;
     res.send(""+Number(weight/(height*height)));

})