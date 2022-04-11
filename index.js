const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));

const mainDB = mongoose.connect('mongodb+srv://admin:thisisaweakpassword@cluster0.igtim.mongodb.net/mainDB?retryWrites=true&w=majority');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: ""
    },
    content: {
        type: String,
        required: true,
        default: ""
    }
});

const Blog = mongoose.model("Blog", blogSchema);


app.listen(80, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server Online");
    }
});

app.get("/", function (req, res) {
    Blog.find({}, function (err, docs) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            res.render("index.ejs", { blogs: docs })
        }
    })
});

app.get("/create", function (req, res) {
    res.render("create.ejs");
});

app.post("/create", function (req, res) {
    const newBlog = new Blog({
        title: req.body.title,
        content: req.body.content
    });
    newBlog.save();
    res.render("create.ejs");
});