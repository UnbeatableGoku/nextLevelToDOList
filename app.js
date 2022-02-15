const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js")


app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb+srv://stardus:stardus123@cluster0.0j3pq.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemSchema = {
    name: String
}

const Item = mongoose.model("item", itemSchema)

const item1 = new Item({
    name: 'Welcome to your todolist'
})

const item2 = new Item({
    name: "Hit + to add new item"
})

const item3 = new Item({
    name: "<-- Hit this to delete the item "
})

const defaultItems = [item1, item2, item3]


app.get("/", function(req, res) {
    var day = date()

    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("DONE")
                }
            })
            res.redirect("/");
        } else {
            res.render("list", { todaySday: day, nextItems: foundItems })
        }
    })
})

app.post("/", function(req, res) {
    const itemName = req.body.nextTask;

    const item = new Item({
        name: itemName
    })

    item.save()
    res.redirect("/")
})


app.post("/delete", function(req, res) {
    const deleteItem = req.body.checkbox

    Item.findByIdAndRemove(deleteItem, function(err) {
        if (!err) {
            console.log("deleted !!!");
        }
    })
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("we connected to server 3000");
})