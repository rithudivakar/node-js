// import './api/routes/orders.js';
// import './api/routes/products.js';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || "3000";

const productRoutes = require('./api/routes/products.js');
const orderRoutes = require('./api/routes/orders.js');
// const con = require('con');

// var mysql = require('mysql');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "shop"
// });


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//

// app.use((req, res, next) => {
//     res.status (200).json({
//         message: 'It works!'
//     });
// });

//Routes which handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
// app.use(con);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

app.listen(port, () => {
    console.log("Server running on port 3000");
   });
   
module.exports = app;
