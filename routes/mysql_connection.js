var mysql = require('mysql2');

const con = mysql.createConnection({
  // host: "localhost",
  host: "172.18.0.1",
  port: 13306,
  user: "root",
  password: "password",
  database: "shop"
});
exports.con = con
