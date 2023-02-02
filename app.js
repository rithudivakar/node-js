// import './api/routes/orders.js';
// import './api/routes/products.js';
const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const client = require("prom-client");
const register = new client.Registry();


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
client.collectDefaultMetrics({
    app: 'node-application-monitoring-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());

});
const httpRequestTimer = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
  });
  register.registerMetric(httpRequestTimer);

  const createDelayHandler = async (req, res) => {
    if ((Math.floor(Math.random() * 100)) === 0) {
      throw new Error('Internal Error')
    }
    // Generate number between 3-6, then delay by a factor of 1000 (miliseconds)
    const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3
    await new Promise(res => setTimeout(res, delaySeconds * 1000))
    res.end('Slow url accessed!');
  };
  app.get('/metrics', async (req, res) => {
    // Start the HTTP request timer, saving a reference to the returned method
    const end = httpRequestTimer.startTimer();
    // Save reference to the path so we can record it when ending the timer
    const route = req.route.path;
      
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  
    // End timer and add labels
    end({ route, code: res.statusCode, method: req.method });
  });
  
  // 
  app.get('/slow', async (req, res) => {
    const end = httpRequestTimer.startTimer();
    const route = req.route.path;
    await createDelayHandler(req, res);
    end({ route, code: res.statusCode, method: req.method });
  });
  
  

// app.get('/metrics', (req, res) => {
//     promClient.register.metrics().then((metrics) => {
//       res.set('Content-Type', promClient.register.contentType);
//       res.end(metrics);
//     });
//   });




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
