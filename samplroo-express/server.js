// we need to import express library to create basic server
const express = require('express')
const app = express()
const port = require('./portNumber');
const attachDatabase = require('./dbProvider');
const getProducts = require('./getProducts');
const getSubCategory = require('./getSubCategory');
const getBrands = require('./getBrands');
const registerUser = require('./registerUser');
const checkEmail = require('./checkEmail');
const verifyEmail = require('./verifyEmail');
const login = require('./logni');
const forgetPassword = require('./forgetPassword');
const https = require('https');
const fs = require('fs');
const setNewPassword = require('./setNewPassword');

var key = fs.readFileSync('./certs/selfsigned.key');
var cert = fs.readFileSync('./certs/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

// this is to serve the ui files from html folder, so that ui and backend will run from same server ie: https://localhost:3000
app.use(express.static('html')); // for front end. 

// for backend. 
// this express.json() is to convert the incoming post data from browser to javascript object and attach it to request body. 
app.use(express.json());
// attach the database instance to request object.
app.use(attachDatabase); // we are creating one instance of database and using it accros all the apis and all the users. 
// to get all the products at first level page
app.get('/products/all', getProducts);
// to get subcategory images and name in the second level page by passing productID 
app.get('/products/category/:productId', getSubCategory);
// to get brands images and name in the third level page by passing subCategoryId
app.get('/brands/category/:subCategoryId', getBrands);
// to register the user with post data. post data contains all the information from email password to address details. 
app.post('/register/user', registerUser);
// to check the email availability so that we can give error in ui for existing emails. 
app.get('/register/checkemail/:email', checkEmail);
// to verify the email by sending email to the use with a link and user can click the link to activate his/her account. 
app.get('/verifyEmail/:id', verifyEmail);
// to login with email and password as post data
app.post('/login', login);
// to initate the forget password email by sending email as post data
app.post('/forgetPassword', forgetPassword);
// to set new password. this api will be called once user click reset link on the email. 
app.post('/setNewPassword', setNewPassword);
// to start the server. 
var server = https.createServer(options, app);

// to login with google signin button. 
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');
const GOOGLE_CLIENT_ID = '46589627879-s3h484oiip5iu6ovb8d1lrqttb1oc3n0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'nIQmH6kjcKkdk9mcRzoFnJiz';
// we are setting google credentials over here. 
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return cb(null, profile.id);
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());

// to start the google authentication flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

// to receive the code from google by callback url. this callback url will be registered in google developer portal. 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// here is where the actual server. 
server.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`)
});
