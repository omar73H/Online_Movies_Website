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
app.post('/', function(req, res) {
  res.render("home");
});
app.post('/login',function(req,res){
  res.render('home');
});
app.get('/registration',function(req,res){
  res.render('registration',{error : ""});
});
app.get('/login',function(req,res){
  res.render('login');
});
var old = fs.readFileSync("users.json");
var users = JSON.parse(old); ;var i = users.length;
app.post('/register',function(req,res){
  var user_name = req.body.username;
  var pass = req.body.password;
  var r = fs.readFileSync("users.json");
  var arr = JSON.parse(r);
  var f = false ;
  if(user_name == "" || pass == ""){
    res.render('registration',{error : "You must fill all the requied Informations"});
  }
  else{
  for(var i = 0 ; i < users.length ; i++){
    if (user_name == users[i].username)
      f = true;
  }
  if(!f){
  var user = {username : user_name , password : pass};
  users[i++] = user ;
  fs.writeFileSync("users.json",JSON.stringify(users));
  res.render('registration',{error : "Successfully registered"});
  }
  else {
   // console.log(f);
   // document.getElementById("demo").innerHTML = "username is already used";
    res.render('registration',{error : "username is already used"});
  }}
});
app.get('/drama',function(req,res){
  res.render('drama');
});
app.get('/horror',function(req,res){
  res.render('horror');
});
app.get('/action',function(req,res){
  res.render('action');
});
app.get('/godfather',function(req,res){
  res.render('godfather');
});
app.get('/godfather2',function(req,res){
  res.render('godfather2');
});
app.get('/scream',function(req,res){
  res.render('scream');
});
app.get('/conjuring',function(req,res){
  res.render('conjuring');
});
app.get('/fightclub',function(req,res){
  res.render('fightclub');
});
app.get('/darkknight',function(req,res){
  res.render('darkknight');
});
//------------------------------------------------------------------------------------------------------------------

// examples for getting pages by requesting the server (app).-----------------------------------


/*var myObj = {name : "Aman" , age : 21};
console.log(myObj);
var j = JSON.stringify(myObj);
console.log(j);
fs.writeFileSync("users.json",j);
var r = fs.readFileSync("users.json");
var obj = JSON.parse(r);
console.log(obj);*/
//end of the examples.---------------------------------------------------------------------------

//to run local and online 
if(process.env.PORT)
  app.listen(process.env.PORT);
else
  app.listen(3000);

module.exports = app;
