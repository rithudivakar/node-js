const express = require('express');
const mysql_connection = require('./mysql_connection');
// import express from 'express';
const router = express.Router();

//GET ALL
router.get('/', (req, res, next) => {
    var sql = "SELECT * FROM products";
    mysql_connection.con.query(sql, function(error, result){
        if(error) throw error;
        res.status(200).json({
            message : 'Products in the table are : ',
            createdProduct: result
        });
    });
});


//INSERT INTO TABLE
router.post('/', (req, res, next) => {
    const product = {
        prod_id: req.body.prod_id,
        prod_name: req.body.prod_name,
        price: req.body.price
            
    };
    mysql_connection.con.connect(function(error){
        if(error) throw error;
        var sql = "INSERT INTO products SET ?";
        mysql_connection.con.query(sql, product, function(error, result){
            if(error) throw error;
            res.status(200).json({
                message : 'handling POST requests to /products',
                createdProduct: product
            });
        });
    });

});


//GET BY ID
router.get('/:prod_id', (req, res, next) => {
    const prod_Id = req.params.prod_Id;
    var sql = "SELECT * FROM products WHERE prod_id = ?";
    mysql_connection.con.query(sql, prod_Id, function(error, result){
        if(error) throw error;
        res.status(200).json({
            message : 'Product in the table with id ',
            product: result
        });
    });
    // if(id === 'special'){
    //     res.status(200).json({
    //         message : 'you discovered the special ID',
    //         id: id
    //     });
    // } else {
    //     res.status(200).json({
    //         message: 'you passed an ID'
    //     });
    // }
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