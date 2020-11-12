const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const PORT = 8080; // default port 8080
const {getUserByEmail} = require('./helper');

app.set("view engine","ejs");
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: '9dgwzx'},
  "9sm5xK": {longURL: "http://www.google.com" , user_id: '9dgwzx'},
  "h4f6td": {longURL: 'http://www.example.com', user_id: '2y1s6h'}
};
const users = {
  '9dgwzx': 
   { id: '9dgwzx',
     email: 'b@b.com',
     hashPassword: '$2b$10$HoRuEfjVc6yVYW6BUceTfeZyAtyI4oe1SwHR5l3o/9BUII2cK..BK' } 
  
  
};
app.use(cookieSession({
  name: 'session',
  keys: ['1','2']
}));
const cookieParser = require("cookie-parser");
//bodyParser is used to convert the buffer data into string server received in POST request from Browser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello!");
});
// retreiving URLS on the client side
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// added a route for /urls
app.get("/urls", (req, res) => {
  const uid = req.session.user_id;
  const urlArray = urlsForUser(uid);
  
  let templateVars;
  if(!uid) {
    templateVars = {
      email: "",
      urls: ""};
   return res.render('urls_index', templateVars);
  }
    templateVars = {
    email: users[uid].email,
    urls: urlArray};
    
   
  
  return  res.render('urls_index', templateVars);
});
// route rendered for new URLs
app.get('/urls/new', (req, res) => {
  const uid = req.session.user_id;
  let templateVars;
  if(!uid) {
    templateVars = {
      email :""
      
    };
   return res.render('urls_login',templateVars);
  }
  templateVars = {
    email: users[uid].email
    
  };
  return res.render('urls_new',templateVars);
});

// added route for short URLS
app.get("/urls/:shortURL", (req, res) => {
  const uid = req.session.user_id;
  let templateVars;
 
  if(!uid) {
    templateVars = { 
      email: "",
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL].longURL };
      return res.render("urls_show", templateVars);
  }
 
  templateVars = { 
    email: users[uid].email,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL };
 
 return res.render("urls_show", templateVars);
});

app.post('/urls/new', (req, res) => {
  
  
  const short = generateRandomString();
  const longURL = req.body['longURL'];
  const user_id = req.session.user_id;
  urlDatabase[short]= {longURL, user_id};
  res.redirect(`/urls/${short}`); // when user posts request by sending long url, it redirects to urls/:short
});
// redirects to the longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

// delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  
  delete urlDatabase[shortURL];
  res.redirect("/urls");
  
});
//for editing the long URL
app.post("/urls/:shortURL", (req, res) => {
  const uid = req.session.user_id;
  if(!uid) {
    return res.status(403).send('Please Login to edit or Delete');
  }
  const long = req.body['longURL'];
  
  const short = req.params.shortURL;
  urlDatabase[short].longURL = long;
  console.log(urlDatabase[short]);
 
  res.redirect(`/urls/${short}`);
});

//route to GET /login page
app.get('/login', (req, res) => {
  res.render('urls_login');
});
//added a POST route to /login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if(getUserByEmail(email, users)) {
    for (let user in users) {
      if (bcrypt.compareSync(password,users[user].hashPassword)) {
        req.session.user_id = user;
       return res.redirect('/urls');
      }
    }
  }
  return res.status(403).send("The email or password is incorrect");

  
});
// for logging out user
app.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/urls');
})

// for get /register endpoint
app.get('/register', (req, res) => {
  res.render('urls_register');
});
// route for post /register
app.post('/register', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const hashPassword = bcrypt.hashSync(password,10);
  if (!email || !password) {
    return res.status('404').send("Please enter a valid email or password");
  }
  if (getUserByEmail(email, users)) {
    return res.status('400').send("The email is already registered, Please enter a valid email");
  }
  const id = generateRandomString();

  users[id] = {id, email, hashPassword};
  
  req.session.user_id = id;
  res.redirect('/urls');
});



// function that returns urls for the logged in user
const urlsForUser = function(id) {
  let a = [];
  let long;
  for (let short in urlDatabase) {
    if (urlDatabase[short].user_id === id) {
      long = urlDatabase[short].longURL;
      a.push({short, long});
    }
  }
  return a;
}

app.listen(PORT, () => {
 console.log(`App listening on port ${PORT}!`);
});
