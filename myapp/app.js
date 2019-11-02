var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//the actual code for the project.
//------------------------------------------------------------------------------------------------------------------
app.get('/', function(req, res) {
  res.render('login', { title: 'Express' });
});
app.get('/registration',function(req,res){
  res.render('registration');
});
var old = fs.readFileSync("users.json");
var users = JSON.parse(old); ;var i = users.length;
app.post('/register',function(req,res){
  var user_name = req.body.username;
  var pass = req.body.password;
  var r = fs.readFileSync("users.json");
  var arr = JSON.parse(r);
  var f = false ;
  for(var i = 0 ; i < users.length ; i++){
    if (user_name == users[i].username)
      f = true;
  }
  if(!f){
  var user = {username : user_name , password : pass};
  users[i++] = user ;
  fs.writeFileSync("users.json",JSON.stringify(users));
  res.render('home');
  }
  else {
    document.getElementById("demo").innerHTML = "username is already used";
  }
});
//------------------------------------------------------------------------------------------------------------------

// examples for getting pages by requesting the server (app).-----------------------------------
app.get('/temp', function(req, res) {
  res.render('temp', { title: 'Express' });
});

app.get('/temp2', function(req, res) {
  res.send("Aman Allah");
});

app.post('/', function(req, res) {
  res.render("home");
});

/*var myObj = {name : "Aman" , age : 21};
console.log(myObj);
var j = JSON.stringify(myObj);
console.log(j);
fs.writeFileSync("users.json",j);
var r = fs.readFileSync("users.json");
var obj = JSON.parse(r);
console.log(obj);*/
//end of the examples.---------------------------------------------------------------------------

app.listen(3000);
module.exports = app;
