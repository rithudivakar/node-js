const express = require('express');
const mysql_connection = require('./mysql_connection');
const promClient = require('prom-client');
const router = express.Router();

const getcounter = new promClient.Counter({
  name: 'get_counter',
  help: 'This is my get counter'
});

const getallcounter = new promClient.Counter({
    name: 'get_all_counter',
    help: 'This is my get all counter'
});

const postcounter = new promClient.Counter({
    name: 'post_counter',
    help: 'This is my post counter'
});
const counter = new promClient.Counter({
    name: 'my_route_counter',
    help: 'This is my route counter'
});

//GET ALL
router.get('/', (req, res, next) => {
    getallcounter.inc();
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
    postcounter.inc();
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
    getcounter.inc();
    const prod_id = req.params.prod_id;
    var sql = "SELECT * FROM products WHERE prod_id = ?";
    mysql_connection.con.query(sql, prod_id, function(error, result){
        if(error) throw error;
        res.status(200).json({
            message : 'Product in the table with id '+prod_id+'',
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

router.patch('/:prod_id', (req, res,next) => {
    counter.inc();
    res.status(200).json({
        message : 'Updated product!'
    });
    // const prod_id = req.params.prod_id;
    // const product = {
    //     prod_id: req.body.prod_id,
    //     prod_name: req.body.prod_name,
    //     price: req.body.price
            
    // };
    // var sql = "UPDATE products SET prod_id = ?, prod_name = ?, price = ? WHERE prod_id = ?"
    // mysql_connection.con.query(sql, product, prod_id, function(error, result){
    //     if(error) throw error;
    //     res.status(200).json({
    //         message : 'Updated Product with id '+prod_id+'',
    //         product: result
    //     });
    // });
});

router.delete('/:prod_id', (req, res, next) => {
    counter.inc();
    res.status(200).json({
        message : 'Deleted product!'
    });
});

module.exports = router;