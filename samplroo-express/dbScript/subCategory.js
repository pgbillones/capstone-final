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
    
    // populate each subCategory from /html/images/categories/{subCategoryFolderName}/* directory
    db.run(`
        CREATE TABLE IF NOT EXISTS "SubCategory" (
            "id"	    INTEGER,
            "productId" TEXT,
            "name"	    TEXT,
            "image"	    TEXT,
            PRIMARY KEY("id")
        )
    `);
    fs.readdirSync(productDir).forEach( async file => {
        const filePath =  path.join(productDir, file);
        if ( fs.lstatSync(filePath).isDirectory() ) {
            fs.readdirSync(filePath).forEach( async subFile => {
                const subFilePath = path.join(filePath, subFile);
                if ( !fs.lstatSync(subFilePath).isDirectory() && !subFile.includes('.DS_Store')  ) {
                    console.log(subFilePath)
                    const imageBase64 = 'data:image/png;base64,' + base64_encode(subFilePath);
                    const subFileName = subFile.substr(0, subFile.lastIndexOf('.')) || subFile;
                    const parentFolderName = subFilePath.split(path.sep)[subFilePath.split(path.sep).length-2];
                    console.log('ParentFolderName: ', parentFolderName);
                    const query1 = `SELECT id from Products WHERE name = "${parentFolderName}"`;
                    const productId = await new Promise( (res, rej) => { db.get(query1, (statement, row, err) => res(row.id) ) }  )
                    const query = `INSERT INTO SubCategory("id","productId","name","image") VALUES (NULL,"${productId}","${subFileName}","${imageBase64}");`;
                    console.log(`INSERT INTO SubCategory("id","productId","name","image") VALUES (NULL,"${productId}","${subFileName}","===");`);
                    db.run(query);
                }
            });
        }
    });

});