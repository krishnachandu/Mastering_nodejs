//jshint esversion:6
const mongoose=require('mongoose')
const url = 'mongodb://localhost:27017'
mongoose.connect(url+"/fruitsdb",{ useNewUrlParser: true })
const dbName = 'fruitsDB'
const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"NAME IS REQUIRED"]
    },
    rating : {
        type: Number,
        min: 1,
        max: 10
    },
    review : String
});
const Fruit = mongoose.model("Fruit", fruitSchema)
// const Person = mongoose.model("person", fruitSchema)

const fruit = new Fruit(
    {
        rating:7,
        review:"Pretty solid as fruit"
    }
)
// fruit.save()
// #Name
// #Age
//Model -Person - John,37
const personSchema = mongoose.Schema({
 name:String,
    age:Number,
    favFruit: fruitSchema
})
const Person= new mongoose.model("Person",personSchema)
const john = new Person({
    name:"John",
    age:37
})
// john.save()

const pears=new Fruit({
    name:"pears",
    score:9,
    review:"Pears Fruit"
})
pears.save();

const amy = new Person({
    name:"Amy",
    age:37,
    favFruit: pears
})
// amy.save()
const kiwi=new Fruit({
    name:"kiwi",
    score:3,
    review:"Too spur"
})
const banana=new Fruit({
    name:"banana",
    score:8,
    review:"Good"
})
// Fruit.insertMany([kiwi,banana], function (err) {
//  if(err){
//      console.log(err);
//  }
//  else{
//      console.log("success")
//  }
// })

Fruit.find(function (err, fruits) {
    if(err){
        console.log(err)
    }
    console.log(fruits)
    fruits.forEach(fruit => console.log(fruit.name));
    // {
    //     console.log(fruit.name)
    // }
    mongoose.connection.close();

})
Person.updateOne({_id:"5ee81ca899f7bf2ee7a01a33"},{favFruit:pears},function (err) {
if(err){
    console.log(err);
}
else{
    console.log('updated');
}
})
//
// Person.deleteMany({name:"John"},function (err) {
// if(err){
//     console.log("err")}
// else {
//     console.log("deleted");
// }
// })