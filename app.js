//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true 
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// Storing the 'secret' as a object
const secret = "Thisisourlittlesecret.";
// Adding encrypt package as a plugin to encrypt the password fields across the entire db
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});  

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    // User credentials
    const username = req.body.username;
    const password = req.body.password;
    // Check if credentials are matching
    User.findOne({email: username}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            // Does the user provide an email that exists
            if (foundUser){
                if (foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    }); 
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});