//jshint esversion: 6
var express=require('express');
var body_parser=require('body-parser');
var request=require('request');
var app=express();
var os=require('os');
app.use(body_parser.urlencoded({extended:true}));
app.listen(3000,function (req,res) {
    console.log("server is running at 3000");

})
app.use(express.static("public"));
app.get("/",function (req,res) {
    res.sendfile(__dirname+"/signup.html");

})
app.post("/failure",function (req,res) {
    res.redirect("/");

})
app.post("/",function (req,res) {
    // var data=JSON.parse(req.body);
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var email = req.body.Email;
    console.log(req.body);
    console.log(firstName);
    console.log(lastName);
    console.log(email);

var data =
    {
        members:
        [{"email_address":email,
            "status":"subscribed",
            merge_fields:
                {
                    FNAME: firstName,
                    LNAME: lastName
                }
        }],
        update_existing:true

    };
var req_body = JSON.stringify(data)
var options=
    {
        url: "https://us4.api.mailchimp.com/3.0/lists/8745f82c6e",
        method: "POST",
        headers:
            {
                "Authorization":"kakula2 5130794b8aefce2db5ce78315d61a60a-us4"
            },
        // body:req_body
    }
request(options,function(error,response, body) {
    var stauscode=response.statusCode
    if(error || stauscode!=200)
    {
        res.sendFile(__dirname+"/failure.html");
    }
    else
    {
        res.sendFile(__dirname+"/success.html");
    }
})
})
//5130794b8aefce2db5ce78315d61a60a-us4

// My audience id is : 8745f82c6e
// lists are now audeince in mailchimp



// 8745f82c6e