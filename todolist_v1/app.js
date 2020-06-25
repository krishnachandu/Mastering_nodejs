const express=require("express")
const bodyParser = require("body-parser");
const app =express()

mongoose=require('mongoose')
//mongodb+srv://admin-chandu:<password>@cluster0-purd9.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongodb://localhost:27017/todolistDB
mongoose.connect("mongodb+srv://admin-chandu:test123@cluster0-purd9.mongodb.net/todolistDB", {useNewUrlParser:true})
const l= require("lodash")
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
var newListItems=[]
var date1 = require(__dirname+"/date.js")
const itemsSchema = mongoose.Schema({
    name:String
})
const listSchema = mongoose.Schema(
    {
        name: String,
        items: [itemsSchema]
    }
)
let Item = mongoose.model("Item", itemsSchema);

let it1=new Item({
    name:"Welcome to do list"
})

let it2=new Item({
    name:"Hit + to add new item"
})

let it3=new Item({
    name:"click checkbox to delete"
})
let defaultItems=[it1,it2,it3]
const List=mongoose.model("List", listSchema);
// List.
app.get("/:param", function (req,res) {
    // List.i
    let customName=  l.capitalize(req.params.param);
    console.log(customName);
    if(customName=="Favicon.ico")
    {
        return;
    }
    List.findOne({"name": customName},function (err,list) {
        if(!list){
            const list1 = new List({
                name: customName,
                items:defaultItems
            })
            list1.save();
            // console.log(customName);
            res.redirect("/"+customName);

        }
        else
        {
            newListItems = [];
            list.items.forEach(function (item) {
                newListItems.push(item._doc)
            })
            res.render("list", {newListItems: newListItems, listTitle: customName});
        }
    })

})
app.get("/", function (req,res) {
    Item.find(function (err, items) {
        if (err) {
            console.log(err)
        }

        // console.log(newListItems);
        if (items.length == 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {

                    res.redirect("/");
                }
            })
        } else {
            newListItems = [];
            items.forEach(function (item) {
                newListItems.push(item._doc)
            })
            // console.log(newListItems);
            res.render("list", {listTitle: "Today", newListItems: newListItems});
        }

    })
})
app.post("/",function (req,res) {
    const itemName = req.body.newItem;
    let listitem = l.capitalize(req.body.customName1);

    // console.log("ItemName is"+itemName);
    // itemData.save(function (err) {
    //     if(err){
    //         console.log(err);}
    //         else{
    //     }
    // });

    if(listitem == "Today") {
        let item= new Item({
            name:itemName
        })
        item.save();
        res.redirect("/")
    }
    else{
        List.findOne({name:listitem}, function (err, foundList) {
            let item= new Item({
                name:itemName
            })
            foundList.items.push(item)
            foundList.save();
        })
        res.redirect("/"+ listitem)
    }
})
app.post("/delete",function (request,response) {
    let id = request.body.checkbox;
    let title = l.capitalize(request.body.customName);
    if(title === "Today"){
        Item.deleteOne({_id:id},function (err) {
            if(!err){
                console.log("response is"+response);
                response.redirect("/");
            }
        })
    }

    else{
        List.findOneAndUpdate( {name:title}, {$pull: {items: { _id:id}}},
            {useFindAndModify:true},function(err,foundList){
            if(!err){
                response.redirect("/"+l.capitalize(title));
            }
            else{
                console.log(err.toString());
            }
        }
        ,
    )
    }


})
app.listen(3000,function (request,response) {
    console.log("server started");
})
