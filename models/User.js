const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required : [true, 'please enter an email'] , 
        unique : true , 
        lowercase : true,
        // validate : [(val) => {return val.includes('@')} , 'please enter a valid email']
        validate : [isEmail , 'please enter a valid email']
    },
        password: {
        type : String,
        required : [true, 'please enter a password'] ,
        minlength : [6, 'Minimum password length is 6 charcters']
    }
});


//fire a function before doc saved to db
userSchema.pre('save' , async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt);
    next();
});

//static method to login user
userSchema.statics.login = async function(email , password){
    try{
        const user = await this.findOne({email})
        if(user){
            const auth = await bcrypt.compare(password , user.password)
            if(auth){
                return user;
            }
            throw Error('incorrect password')
        }
        throw Error('incorrect email')
    }
    catch(err){
        throw Error(err)
    }
}

const User = mongoose.model('user' , userSchema)

module.exports = User ;