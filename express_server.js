const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine","ejs");
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//bodyParser is used to convert the buffer data into string server received in POST request from Browser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req, res) => {
  res.send("Hello!");
});
// retreiving URLS on the client side
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// added a route for /urls
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});
// route rendered for new URLs
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// added route for short URLS
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post('/urls', (req, res) => {
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


// Response can contain HTML text too
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});