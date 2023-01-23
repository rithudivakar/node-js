const express = require('express');
const mysql_connection = require('./mysql_connection');
// import express from 'express';
const router = express.Router();

// var mysql = require('mysql');

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "shop"
// });
//exports.con = con


router.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    const product = {
        prod_id: req.body.prod_id,
        prod_name: req.body.prod_name,
        price: req.body.price
            
    };
    mysql_connection.con.connect(function(error){
        if(error) throw error;
        var sql = "INSERT INTO products (prod_id, prod_name, price) VALUES (?) ";
        // var values= {
        //     prod_id: req.body.prod_id,
        //     prod_name: req.body.prod_name,
        //     price: req.body.price
                
        // };
        mysql_connection.con.query(sql, product, function(error, result){
            if(error) throw error;
            res.status(200).json({
                message : 'handling POST requests to /products',
                createdProduct: product
            });
        });
    });


    // con.connect(function(error){
    //     if(error) throw error;
    //     console.log("Connected");
    //     var sql = "INSER INTO shop (prod_id. prod_name, price VALUES (?, ?, ?)) ";
    //     var values= product;
    //     con.query(sql, values, function(error, result){
    //         if(error) throw error;
    //         res.status(200).json({
    //             message : 'handling POST requests to /products',
    //             createdProduct: product
    //         });
    //     });
    // });


});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(id === 'special'){
        res.status(200).json({
            message : 'you discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'you passed an ID'
        });
    }
});

router.patch('/:productId', (req, res,next) => {
    res.status(200).json({
        message : 'Updated product!'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message : 'Deleted product!'
    });
});

module.exports = router;