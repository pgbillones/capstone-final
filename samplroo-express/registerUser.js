const sendEmail = require('./sendEmail');
const port = require('./portNumber');
const hostName = require('./hostName');
const { v4: uuidv4 } = require('uuid');

const registerUser = async (req, res) => {
    const db = req.db;
    const postData = req.body;
    const {
        email, 
        password,
        age,
        userdetailsTerms,
        firstName,
        address,
        field1,
        province,
        lastName,
        unit,
        postalCode,
        country,
        shippingTerms,
        subCategoryId,
        brandId,
        productId
      } = postData;
    db.serialize( () => {
        // uuidv4() function will produce universally unique id. 
        // we are storing the user details into database. ( while creatin new user, i am setting isEmailVerified column to false )
        const query = `INSERT INTO "main"."Users"("id","uid","isSocial","loginProvider","socialId","email","password","isEmailVerified","age","firstName","lastName","address","unit","field1","province","postalCode","country","productsId","subCategoriesId","brandsId") 
                                          VALUES (NULL,"${uuidv4()}","false",NULL,NULL,                     "${email}","${password}","false",     "${age}","${firstName}","${lastName}","${address}","${unit}","${field1}","${province}","${postalCode}","${country}","${productId}","${subCategoryId}","${brandId}");`;

        // we are running the query 
        db.run(query, function (err) {
            // after query runs successfully, we will get the last inserted ID.
            const lastId = this.lastID;
            console.log(lastId);
            // i am selecting the user record by lastID
            db.get(`SELECT * FROM "Users" WHERE id = "${lastId}"`, function(err, row) {
                // generating the link to be sent on email. 
                const link = `${hostName}${port}/verifyEmail/${row.uid}`;
                // we are sending that email.
                sendEmail(email, "SamplRoo: Confirm your email", `
                <h5> Welcome to SamplRoo </h5>
                Please click this <a href="${link}" >${link} </a> to confirm your email address. 
                `).then( () => {
                    res.send({});
                }).catch((err)=> console.error(err));
            } );
            
        } );
    });
}

module.exports = registerUser;
