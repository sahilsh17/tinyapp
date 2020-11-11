const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine","ejs");
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  '1' : {
    id: '1',
    email: 'a@a.com',
    password: '1234'
  },
  '2' : {
    id: '2',
    email: 'c@c.com',
    password: '5678'
  }
  
}
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
  const uid = req.cookies["user_id"];
  const templateVars = {
    user: users[uid],
    urls: urlDatabase};
    
   
  
  res.render('urls_index', templateVars);
});
// route rendered for new URLs
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// added route for short URLS
app.get("/urls/:shortURL", (req, res) => {
  const uid = req.cookies["user_id"];
  const templateVars = { 
    user: users[uid],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] };
 
  res.render("urls_show", templateVars);
});

app.post('/urls/new', (req, res) => {
  console.log(req.body);
  
  const short = generateRandomString();
  const long = req.body['longURL'];
  urlDatabase[short] = long;
  res.redirect(`urls/${short}`); // when user posts request by sending long url, it redirects to urls/:short
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
  const long = req.body['longURL'];
  
  const short = req.params.shortURL;
  urlDatabase[short] = long;
  
 
  res.redirect("urls_show");
})
//added a POST route to /login
app.post("/login", (req, res) => {
  const user = req.body['username'];
  res.cookie('username', user);
  res.redirect('/urls');
});
// for logging out user
app.post('/logout', (req, res) => {
  res.clearCookie('username');
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
  if (!email || !password) {
    res.status('404').send("Please enter a valid email or password");
  }
  if (emailLooker(email)) {
    res.status('400').send("The email is already registered, Please enter a valid email");
  }
  const id = randomIDgenerator();

  users[id.toString()] = {id, email, password};
  res.cookie('user_id', id);
  res.redirect('/urls');
});

const randomIDgenerator = function() {
  const k = Object.keys(users);
  return k.length + 1;
};
//looks if user object already has an email
const emailLooker = function(email) {
  for(let user in users) {
    if(user.email === email) {
      return true;
    } else {
      return false;
    }
  }
}

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });
app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}!`);
});