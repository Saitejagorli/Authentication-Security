//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const userschema = {
    email: String,
    password: String
};

const User = mongoose.model("User", userschema);


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("secrets");
            }
        });
    });



});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function (err, founduser) {
        bcrypt.compare(password, founduser.password, function (err, result) {
            if (result) {
                res.render("secrets");
            }
        });
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
