const express=require("express");
const app=express();
const request=require("request");
// __dirname = path.resolve();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function (req,res) {
        res.sendFile(__dirname+"/index.html");
})
app.listen(7000,function (req,res) {
    console.log("Server running at 7000");
})
app.post("/", function (req,res) {
    final_url = req.body.crypto+req.body.fiat;


        // https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD
    console.log("http://apiv2.bitcoinaverage.com/indices/global/ticker/"+final_url);
    request("http://apiv2.bitcoinaverage.com/indices/global/ticker/"+final_url,function (error,response,body) {
        // console.log(response.body);
        var data=JSON.parse(body);
        var price=data.last;

        res.send("The fiat currency chosen is\n"+req.body.fiat+"The crypto currency chosen is\n"+req.body.crypto+"The price is\n"+price);

    })


})
