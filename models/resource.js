let mongoose = require('mongoose');

//resource schemma
let resourceSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

let Resource = module.exports = mongoose.model('Resource', resourceSchema);