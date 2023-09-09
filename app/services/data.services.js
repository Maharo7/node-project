const mongoose = require('mongoose');
const envConfig = require('../config/env.config');
const url = envConfig.urlDatabase;

function connectDatabase() {
    mongoose.connect(url)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })
}

module.exports = { connectDatabase };
