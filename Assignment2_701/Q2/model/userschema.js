const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/mean',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to the database');
});
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    mobileno: String,
    profilepic: String
});
const User = mongoose.model('usertb', userSchema);

module.exports=User;