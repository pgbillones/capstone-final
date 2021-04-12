var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db.sqlite');
// we are creating db instance using sqlite3 library and passign to server. 
const attachDatabase = (req, res, next) => {
    req.db = db;
    next();
}

module.exports = attachDatabase;


// downside of other databases 
// 1. you need to run the database server seperately and establish connection between database server and backend server. 
// 2. migrating the database is difficult. ( moving the database form one computer to another )