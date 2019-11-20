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
var films = ["The Conjuring (2013)","The Dark Knight (2008)","Fight Club (1999)","The Godfather (1972)",
              "The Godfather: Part II (1974)","Scream (1996)"];

// if the user is NOT logged in then he/she can not go to any page other than / , /login ,/register
const isLogedIn = (req,res,next) => {
  if(!req.session.username){
    res.redirect('/login');
  }
  else{
    next();
  }
}

// if the user is logged in then he can not got to either / , /login , /register
const redirectHome = (req,res,next) => {
  if(req.session.username){
    res.redirect('/home');
  }
  else{
    next();
  }
};

// if the user writes our URL then redirects him/her to the login page
app.get('/', redirectHome ,function(req, res) {
  res.redirect('/login');
});

// if the user asks directly for the login page then render it to him/her
app.get('/login', redirectHome ,function(req,res){
  res.render('login',{error : ""});
});

// if the user asks for the home page and he/she is already logged in then render it to him/her"
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
app.get('/register', redirectHome ,function(req,res){
  res.render('registration',{error : ""});
});

app.get('/registration', redirectHome ,function(req,res){
  res.redirect('/register');
});

// old reads the old_database from the JSON file
var old = fs.readFileSync("users.json");
if(old == "")
{
  old = "[]";
}
var users = JSON.parse(old); // array of users by parsing the JSON file string 
var i = users.length; // i is pointing after the last element

// when I get a post request in the registration page I do the following
app.post('/register', redirectHome ,function(req,res){
  var user_name = req.body.username; // I get the username
  var pass = req.body.password; // I get the passwword 
  var f = false ; // I create a flag
  if(user_name == "" || pass == "") // if user does not fill the required info
  {
    res.render('registration',{error : "You must fill all the required Informations try to register again"});
  }
  else
  {
    for(var k = 0 ; k < users.length ; k++) // I will check if the username already exists
    {
      if (user_name == users[k].username)
      {
        f = true;
        break;
      }
    }
    if(!f) // if not already exists
    {
      var user = {username : user_name , password : pass,watchlist : []}; // make a new account for its info
      users[i++] = user ; // put it at the last position in my JSON DB and point after it by i
      fs.writeFileSync("users.json",JSON.stringify(users)); // save my new JSON DB
      res.render('registration',{error : "Successfully registered , Now You can Login"}); // show a successful message
    }
    else 
    {
    // console.log(f);
    // document.getElementById("demo").innerHTML = "username is already used";
      res.render('registration',{error : "username is already used"});
    }
  }
});

// when the users want to login
app.post('/login', redirectHome ,function(req,res){
  var user_name = req.body.username; // get the username
  var pass = req.body.password; // get the password
  var f = false ; // have a flag initially false
  for(var k = 0 ; k < users.length ; k++) // iterate on each account in my JSON DB to check for valid login
  {
    if (user_name == users[k].username && pass == users[k].password)
    {
      f = true;
      break;
    }
  }
  if(f) // if correct cardinalities (i.e username and password)
  {
    req.session.username = user_name; // make a new session for the user identified by its username
    // sessionStorage.setItem(user_name);
    res.redirect('/home'); // redirect him to the home page
  }
  else 
  {
    // console.log(f);
    // document.getElementById("demo").innerHTML = "username is already used";
    res.render('login',{error :"You Entered invalid username or password"}); // invalid login message
  }
});

// if logged users want to open Drama then render it
app.get('/drama',isLogedIn,function(req,res){
  res.render('drama');
});

// if logged users want to open horror then render it
app.get('/horror',isLogedIn,function(req,res){
  res.render('horror');
});

// if logged users want to open action then render it
app.get('/action',isLogedIn,function(req,res){
  res.render('action');
});

// if logged users want to open godfather then render it
app.get('/godfather',isLogedIn,function(req,res){
  res.render('godfather');
});

//if logged users want to add godfather to their watchlists
app.post('/godfather',isLogedIn,function(req,res){
  var currUser = req.session.username // get the username of the user who add
  loop:
  for(var k=0 ; k<users.length ; k++)
  {
    if(currUser == users[k].username) // get its index in my JSON DB
    {
      var userWatchlist = users[k].watchlist; // get its watchlist
      for(var j=0; j<userWatchlist.length ; j++) // check that it was not added before
      {
        if(userWatchlist[j] == "The Godfather (1972)") // if added 
        {
          res.render('godfather') //  error message and do not add anything
          break loop;
        }
      }
      userWatchlist.push("The Godfather (1972)"); // + successuflly added
      fs.writeFileSync("users.json",JSON.stringify(users)); // save my new JSON DB
      res.render('godfather');
      break;
    }
  }
});


//// if logged users want to open godfather2 then render it
app.get('/godfather2',isLogedIn,function(req,res){
  res.render('godfather2');
});

//if logged users want to add godfather2 to their watchlists
app.post('/godfather2',isLogedIn,function(req,res){
  var currUser = req.session.username
  loop:
  for(var k=0 ; k<users.length ; k++)
  {
    if(currUser == users[k].username)
    {
      var userWatchlist = users[k].watchlist;
      for(var j=0; j<userWatchlist.length ; j++)
      {
        if(userWatchlist[j] == "The Godfather: Part II (1974)")
        {
          res.render('godfather2') //+ error message
          break loop;
        }
      }
      userWatchlist.push("The Godfather: Part II (1974)"); // + successfully added
      fs.writeFileSync("users.json",JSON.stringify(users)); // save my new JSON DB
      res.render('godfather2');
      break;
    }
  }
});


// if logged users want to open Scream then render it
app.get('/scream',isLogedIn,function(req,res){
  res.render('scream');
});


//if logged users want to add scream to their watchlists
app.post('/scream',isLogedIn,function(req,res){
  var currUser = req.session.username
  loop:
  for(var k=0 ; k<users.length ; k++)
  {
    if(currUser == users[k].username)
    {
      var userWatchlist = users[k].watchlist;
      for(var j=0; j<userWatchlist.length ; j++)
      {
        if(userWatchlist[j] == "Scream (1996)")
        {
          res.render('scream') //+ error message
          break loop;
        }
      }
      userWatchlist.push("Scream (1996)");
      fs.writeFileSync("users.json",JSON.stringify(users)); // save my new JSON DB
      res.render('scream');
      break;
    }
  }
});


// if logged users want to open conjuring then render it
app.get('/conjuring',isLogedIn,function(req,res){
  res.render('conjuring');
});


//if logged users want to add conjuring to their watchlists
app.post('/conjuring',isLogedIn,function(req,res){
  var currUser = req.session.username
  loop:
  for(var k=0 ; k<users.length ; k++)
  {
    if(currUser == users[k].username)
    {
      var userWatchlist = users[k].watchlist;
      for(var j=0; j<userWatchlist.length ; j++)
      {
        if(userWatchlist[j] == "The Conjuring (2013)")
        {
          res.render('conjuring') //+ error message
          break loop;
        }
      }
      userWatchlist.push("The Conjuring (2013)");
      fs.writeFileSync("users.json",JSON.stringify(users)); // save my new JSON DB
      res.render('conjuring');
      break;
    }
  }
});


// if logged users want to open fightclub then render it
app.get('/fightclub',isLogedIn,function(req,res){
  res.render('fightclub');
});


// if logged users want to add fightclub to their watchlists
app.post('/fightclub',isLogedIn,function(req,res){
  var currUser = req.session.username
  console.log(currUser);
  loop:
  for(var k=0 ; k<users.length ; k++)
  {
    if(currUser == users[k].username)
    {
      var userWatchlist = users[k].watchlist;
      for(var j=0; j<userWatchlist.length ; j++)
      {
        if(userWatchlist[j] == "Fight Club (1999)")
        {
          res.render('fightclub') //+ error message
          break loop;
        }
      }
      userWatchlist.push("Fight Club (1999)");
      fs.writeFileSync("users.json",JSON.stringify(users)); // save my new JSON DB
      res.render('fightclub');
      break;
    }
  }
});


// if logged users want to open darkknight then render it
app.get('/darkknight',isLogedIn,function(req,res){
  res.render('darkknight');
});


//if logged users want to add darkknight to their watchlists
app.post('/darkknight',isLogedIn,function(req,res){
  var currUser = req.session.username
  loop:
  for(var k=0 ; k<users.length ; k++)
  {
    if(currUser == users[k].username)
    {
      var userWatchlist = users[k].watchlist;
      for(var j=0; j<userWatchlist.length ; j++)
      {
        if(userWatchlist[j] == "The Dark Knight (2008)")
        {
          res.render('darkknight') //+ error message
          break loop;
        }
      }
      userWatchlist.push("The Dark Knight (2008)");
      fs.writeFileSync("users.json",JSON.stringify(users)); // save my new JSON DB
      res.render('darkknight');
      break;
    }
  }
});


// if logged users want to open ---->(their watchlist)<---- then render it
app.get('/watchlist',isLogedIn,function(req,res){
  var currUser = req.session.username; // get the username of whom wanting his/her watchlist 
  for(var k=0; k<users.length ;k++)
  {
    if(currUser = users[k].username) 
    {
      var userWatchlist = users[k].watchlist; // get its saved watchlist array
      break;
    }
  }
  res.render('watchlist',{userWatchlist : userWatchlist}); // render the watchlist with his/her watchlist
});

// if you are a logged in user so you can be a logged out xD
app.post('/logout',isLogedIn,(req,res) =>{ 
  req.session.destroy(err =>{ // destroy the user session
    if(err) // if errors happen render him to home page again to relogout
    {
      res.redirect('/home');
    }
    else // else logout
    {
      res.redirect('/login');
    }
  })
});
//Search Bar----------------------------------------------------------------------------------------
app.post('/search',isLogedIn,function(req,res){
  var word = req.body.Search;
  var results = [];
  results.push(word);
  films.forEach(function(film){
    if((film.toLowerCase()).includes(word)){
      results.push(film);
    }
  });
  res.render('searchresults',{results : results});
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