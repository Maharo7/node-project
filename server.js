const express = require('express');
const { basicRoutes } = require('./app/routes/basics.routes');
const app = express();
const dataService = require('./app/services/data.services');

dataService.connectDatabase()
    .then(response => {
      if(response) {
         const server = app.listen(8081, function () {
            var port = server.address().port;
            console.log("Example app listening at http://localhost:"+port);
         });
         basicRoutes(app);
         app.emit('serverReady');
      }
    })
    .catch(error => {
        console.error('Error: ' + error);
    });

module.exports = app;