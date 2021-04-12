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

    // populate all brands from /html/images/categories/{subCategoryFolder}/{brandFolder}/* directory
    db.run(`
        CREATE TABLE IF NOT EXISTS "Brands" (
            "id"	    INTEGER,
            "subCategoryId" TEXT,
            "name"	    TEXT,
            "image"	    TEXT,
            PRIMARY KEY("id")
        )
    `);
    fs.readdirSync(productDir).forEach( async file => {
        const filePath =  path.join(productDir, file);
        if ( fs.lstatSync(filePath).isDirectory() ) { // if the file is in directory already 
            fs.readdirSync(filePath).forEach( async subFile => {
                const subCategoryPath =  path.join(filePath, subFile);
                if ( fs.lstatSync(subCategoryPath).isDirectory() ) {
                    fs.readdirSync(subCategoryPath).forEach( async brandFile => {
                        const brandpath =  path.join(subCategoryPath, brandFile);
                        if ( !fs.lstatSync(brandpath).isDirectory() && !brandFile.includes('.DS_Store')  ) {
                            // console.log(brandpath);
                            const imageBase64 = 'data:image/png;base64,' + base64_encode(brandpath);
                            const brandFileName = brandFile.substr(0, brandFile.lastIndexOf('.')) || brandFile;
                            const parentFolderName = brandpath.split(path.sep)[brandpath.split(path.sep).length-2];
                            const query1 = `SELECT id from SubCategory WHERE name = "${parentFolderName}"`;
                            
                            const subCategoryId = await new Promise( (res, rej) => { db.get(query1, (statement, row, err) => {
                                console.log(query1, row)
                                res(row.id) 
                            } )  }  )
                            const query = `INSERT INTO Brands("id","subCategoryId","name","image") VALUES (NULL,"${subCategoryId}","${brandFileName}","${imageBase64}");`;
                            if ( subCategoryId > 25 && subCategoryId < 30 )
                            console.log(subCategoryId)
                            db.run(query);
                        }
                    });
                }
            });
        }
    });


});

// db.close();

