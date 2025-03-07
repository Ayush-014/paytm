const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ayush014:ri2UQp2xRHG5cjIt@cluster0.tzfecbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => console.log("connection to mongoose succesfull "))
.catch(err => console.log("Error while connecting mongoose: " + err));

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowecase: true,
        minLength: 4,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        // unique: true
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, //reference to User model
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account,
};