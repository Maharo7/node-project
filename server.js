const express = require('express');
const { basicRoutes } = require('./app/routes/basics.routes');
const app = express();
const dataService = require('./app/services/data.services');


const server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://localhost:"+port)
});


dataService.connectDatabase();
basicRoutes(app);