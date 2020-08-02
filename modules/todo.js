const mongoose = require('mongoose');
mongoose.connect('Your Database Connection Path', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

var conn = mongoose.Collection;
var todoSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

var todoModel = mongoose.model('todos', todoSchema);
module.exports = todoModel;