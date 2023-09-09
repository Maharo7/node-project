const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollutionSchema = new Schema({
    ts: {
        type: Date,
        required:true
    },
    aqius: {
        type: Number,
        required:true
    },
    mainus:{
        type: String,
        required:true
    },
    aqicn:{
        type: Number,
        required:true
    },
    maincn:{
        type: String,
        required:true
    }
})
module.exports = mongoose.model('pollution', pollutionSchema);