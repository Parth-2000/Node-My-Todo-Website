const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://parth:Ppy@12345@cluster0.tzkaa.mongodb.net/todo?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
        index: {
            unique: true,
        },
    },
    email: {
        type: String,
        // required: true,
        index: {
            unique: true,
        },
    },
    password: {
        type: String,
        // required: true,
    },
    gender: {
        type: String,
        // required: true,
    },
    contactnumber: {
        type: Number,
        // required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

var userModel = mongoose.model('users', userSchema);
module.exports = userModel;