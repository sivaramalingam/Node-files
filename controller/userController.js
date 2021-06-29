const mysql = require('mysql');
const { connection } = require('../config/db');
const jwt = require('jsonwebtoken');
const PaytmChecksum = require("paytmchecksum");
const https = require('https');

exports.createchecksum = ((req, res) => {
    /*
    * import checksum generation utility
    * You can get this utility from https://developer.paytm.com/docs/checksum/
    */
    // const PaytmChecksum = require('./PaytmChecksum');

    var paytmParams = {};

    paytmParams.body = {
        "requestType": "Payment",
        "mid": req.body.MID,
        "websiteName": "WEBSTAGING",
        "orderId": req.body.ORDER_ID,
        "callbackUrl": req.body.CALLBACKURL,
        "txnAmount": {
            "value": "10.00",
            "currency": "INR",
        },
        "userInfo": {
            "custId": req.body.EMAIL,
        },
    };
    const merchantKey = 'hMt77S7YMChhPzIM';
    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), merchantKey).then(function (checksum) {
        console.log(checksum);
        paytmParams.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${req.body.MID}&orderId=${req.body.ORDER_ID}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                console.log('Response: ', response);
            });
        });

        post_req.write(post_data);
        post_req.end();
    });
});

exports.verifyPayment = ((req, res) => {
    res.status(200).send("running");
});

exports.testCtrl = ((req, res) => {
    res.send("successfully configures ctrl");
});

exports.authUser = ((req, res) => {
    const username = req.body.uname;
    const pwd = req.body.pwd;
    let isAuth = false; let sendText = ''; let jwtoken = '';
    connection.query(`select * from users where name= '${username}' and password='${pwd}'`, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            if (rows.length > 0) {
                isAuth = true;
                jwtoken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
            }
            sendText = { "auth": isAuth, "token": jwtoken, "user": username };
            res.status(200).send(sendText);
        }
    });
});

exports.getUsers = ((req, res) => {
    connection.query('select * from users', (err, rows) => {
        if (err) {
            console.log('err');
        } else {
            res.status(200).send({ users: rows });
        }
    });
});

exports.getProducts = ((req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401)
            .send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(500)
                .send({ auth: false, message: 'Failed to authenticate token.' });
        }
        connection.query('select * from products', (err, rows) => {
            if (err) {
                console.log('err');
            } else {
                res.status(200).send({ products: rows });
            }
        });
    })
});

exports.getCategories = ((req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401)
            .send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(500)
                .send({ auth: false, message: 'Failed to authenticate token.' });
        }
        connection.query('select * from categories', (err, rows) => {
            if (err) {
                console.log('err');
            } else {
                res.status(200).send({ categories: rows });
            }
        });
    })
});

exports.addCategory = ((req, res) => {
    const token = req.headers['authorization'];
    console.log(token)
    if (!token) {
        return res.status(401)
            .send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(500)
                .send({ auth: false, message: 'Failed to authenticate token.' });
        }
        const categorySql = `INSERT INTO categories(cid, cname, cdesc) VALUES (?, ?, ?)`;

        connection.query(categorySql, [req.body.cid, req.body.cname, req.body.cdesc], (err, rows) => {
            if (err) {
                console.log('err');
            } else {
                res.status(200).send({ message: "Categort Inserted Successfully!" });
            }
        });
    })
});

exports.addProduct = ((req, res) => {
    const token = req.headers['authorization'];
    console.log(token)
    if (!token) {
        return res.status(401)
            .send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(500)
                .send({ auth: false, message: 'Failed to authenticate token.' });
        }
        const sql = 'INSERT INTO `products`(`pid`, `pname`, `brand`, `pdesc`, `category`, `price`) VALUES (?,?,?,?,?,?)';

        connection.query(sql, [req.body.pid, req.body.pname, req.body.brand, req.body.pdesc, req.body.category, req.body.price], (err, rows) => {
            if (err) {
                console.log('err');
            } else {
                res.status(200).send({ message: "Prduct added successfully!" });
            }
        });
    })
});

// exports.addUsers = ((req, res) => {
//     userList.countDocuments((err, count) => {
//         const newUserId = count + 1;
//         const actualId = 'R' + ('00000' + newUserId).slice(-5);

//         userList.create({ "first_name": "test32", "last_name": "user", "password": "12345", "email_address": "1234@gamil.com", "contact_no": "99998873432", "user_id": actualId, }, (err, user) => {
//             if (err) return handleError(err);
//             else {
//                 res.send("insert document successfully!!");
//             }

//         });
//     });
// });

// exports.updateUser = ((req, res) => {
//     let userData = {
//         contact_no: req.query.contact_no,
//         email_address: req.query.email_address
//     }
//     userList.updateMany({ user_id: req.query.user_id }, userData, { upsert: true }, ((err, data) => {
//         if (err) return res.status(500).send({ error: err });

//         return res.send('Succesfully saved.');
//     }))
// });

// exports.deleteUser = ((req, res) => {
//     userList.findByIdAndDelete({ user_id: req.query.user_id }, ((err, data) => {
//         if (err)
//             return res.status(500).send({ error: err });

//         return res.send('Deleted Successfully.');
//     }));
// });

