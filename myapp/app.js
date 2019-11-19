var express = require('express');
var path = require('path');
var fs = require('fs');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'max',saveUninitialized: true,resave: false}));

//the actual code for the project.
//------------------------------------------------------------------------------------------------------------------
const isLogedIn = (req,res,next) => {
  if(!req.session.username){
    res.redirect('login');
  }
  else{
    next();
  }
}

// if the user writes our URL then redirects him/her to the login page
app.get('/', function(req, res) {
  res.redirect('login');
});

// if the user asks directly for the login page then render it to him/her
app.get('/login',function(req,res){
  res.render('login',{error : ""});
});

// I think "if the user asks for the home page and he/she is already logged in then render it to him/her"
app.get('/home',isLogedIn,function(req,res){
  res.render('home');
})

// NOTE : we have an error when the user type this URL "http://localhost:3000/register"
//that's error is because the user is allowed to enter the registration page by two differenr URLs namely
//1)"http://localhost:3000/register" && 2) "http://localhost:3000/registration"
// SO let's fix it
//we can do the following
// when the user types the URL "http://localhost:3000/register"
// we redirect him/her to '/registration'
// in the following two methods we do the following:
// if the user asks to enter the registration page so render it to him/her
app.get('/register',function(req,res){
  res.redirect('/registration');
});

app.get('/registration',function(req,res){
  res.render('registration',{error : ""});
});
var old = fs.readFileSync("users.json");
if(old == "")
{
  old = "[]";
}
var users = JSON.parse(old);
var i = users.length;
app.post('/register',function(req,res){
  var user_name = req.body.username;
  var pass = req.body.password;
//  var r = fs.readFileSync("users.json");
//  var arr = JSON.parse(r);
  var f = false ;
  if(user_name == "" || pass == "")
  {
    res.render('registration',{error : "You must fill all the requied Informations try to login again"});
  }
  else
  {
    for(var k = 0 ; k < users.length ; k++)
    {
      if (user_name == users[k].username)
      {
        f = true;
        break;
      }
    }
    if(!f)
    {
      var user = {username : user_name , password : pass,watchlist : []};
      users[i++] = user ;
      fs.writeFileSync("users.json",JSON.stringify(users));
      res.render('registration',{error : "Successfully registered , Now You can Login"});
    }
    else 
    {
    // console.log(f);
    // document.getElementById("demo").innerHTML = "username is already used";
      res.render('registration',{error : "username is already used"});
    }
  }
});
app.post('/login',function(req,res){
  var user_name = req.body.username;
  var pass = req.body.password;
//  var r = fs.readFileSync("users.json");
//  var arr = JSON.parse(r);
  var f = false ;
  for(var k = 0 ; k < users.length ; k++)
    {
      if (user_name == users[k].username && pass == users[k].password)
      {
        f = true;
        break;
      }
    }
  if(f)
    {
      req.session.username = user_name;
     // sessionStorage.setItem(user_name);
      res.redirect('home');
    }
  else 
    {
    // console.log(f);
    // document.getElementById("demo").innerHTML = "username is already used";
      res.render('login',{error :"You Entered unvalid username or password"});
    }
});
app.get('/drama',isLogedIn,function(req,res){
  res.render('drama');
});
app.get('/horror',isLogedIn,function(req,res){
  res.render('horror');
});
app.get('/action',isLogedIn,function(req,res){
  res.render('action');
});
app.get('/godfather',isLogedIn,function(req,res){
  res.render('godfather');
});
app.get('/godfather2',isLogedIn,function(req,res){
  res.render('godfather2');
});
app.get('/scream',isLogedIn,function(req,res){
  res.render('scream');
});
app.get('/conjuring',isLogedIn,function(req,res){
  res.render('conjuring');
});
app.get('/fightclub',isLogedIn,function(req,res){
  res.render('fightclub');
});
app.get('/darkknight',isLogedIn,function(req,res){
  res.render('darkknight');
});
app.get('/watchlist',isLogedIn,function(req,res){
  res.render('watchlist');
});
app.post('/conjuring',isLogedIn,function(req,res){
  console.log(req.session.username);
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
