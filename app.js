// import './api/routes/orders.js';
// import './api/routes/products.js';
const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const promClient = require("prom-client");
// const actuator = require('express-actuator');
// app.use(actuator());
const port = process.env.PORT || "8080";


const productRoutes = require('./api/routes/products.js');
const orderRoutes = require('./api/routes/orders.js');

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

// app.use((req, res, next) => {
//     const error = new Error('Not found');
//     // error.status(404);
//     next(error);
// })

// app.use((error, req, res, next) => {
//     // res.status(error.status || 500);
//     res.json({
//         error: {
//             message: error.message
//         }
//     })
// });

//Create and register metrics:
// const counter = new promClient.Counter({
//     name: 'requests_total',
//     help: 'Total number of requests made',
//     labelNames: ['method']
// });
  
// promClient.register.registerMetric(counter);
  
//Collect and expose metrics:
// app.get('/metrics', (req, res) => {
//     res.set('Content-Type', promClient.register.contentType);
//     res.end(promClient.register.metrics());
// });

app.get('/metrics', (req, res) => {
    promClient.register.metrics().then((metrics) => {
      res.set('Content-Type', promClient.register.contentType);
      res.end(metrics);
    });
  });


//Increment the metric:

app.get('/', (req, res) => {
    counter.inc({ method: 'GET' });
    res.send('Hello World!');
});


// Runs after each requests
// app.use((req, res, next) => {
//     const responseTimeInMs = Date.now() - res.locals.startEpoch
  
//     httpRequestDurationMicroseconds
//       .labels(req.method, req.route.path, res.statusCode)
//       .observe(responseTimeInMs)
  
//     next()
//   });

app.listen(port, () => {
    console.log("Server running on port 8080");
   });
   
module.exports = app;
