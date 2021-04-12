var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../db.sqlite');
const { constants } = require('buffer');
const fs = require('fs');
var path = require('path');

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}

const productDir = '../html/images/categories/';

db.serialize( async () => {

    // populate all products from /html/images/categories/* directory
    db.run(`
        CREATE TABLE IF NOT EXISTS "Products" (
            "id"	INTEGER,
            "name"	TEXT,
            "image"	TEXT,
            PRIMARY KEY("id")
        )
    `);

    fs.readdirSync(productDir).forEach(file => {
        const filePath = path.join(productDir, file);
        console.log(filePath)
        if ( !fs.lstatSync(filePath).isDirectory() && !file.includes('.DS_Store') ) {
            console.log(file);
            const imageBase64 = 'data:image/png;base64,' + base64_encode(filePath);
            const fileName = file.substr(0, file.lastIndexOf('.')) || file;
            const query = `INSERT INTO Products("id","name","image") VALUES (NULL,"${fileName}","${imageBase64}");`;
            db.run(query);
        }
    });
});
// db.close();