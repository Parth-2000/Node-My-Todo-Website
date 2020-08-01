const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://parth:Ppy@12345@cluster0.tzkaa.mongodb.net/todo?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

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