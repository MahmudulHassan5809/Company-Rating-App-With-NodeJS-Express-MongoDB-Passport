const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const UserSchema = new Schema({
  fullname:{
    type: String,
     required: [true,'Please Provide Full Name']
  },
  email:{
    type: String,
    required: [true,'Please Provide Email']
  },
  password:{
    type: String,
  },
  role:{
    type: String,
    default: ''
  },
  company:{
      name: {type: String,default:''},
      image: {type: String,default:''}
  },
  passwordResetToken:{
      type:String,
      default: ''
  },
  passwordResetExpries:{
      type:Date,
      default: Date.now
  },
  googleID:{
    type: String,

  },
  date:{
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10,(err,salt) => {
  if (err) return next(err);
  bcrypt.hash(user.password,salt,null, (err,hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
  });

});

UserSchema.methods.comparePassword  = function(password) {
  return bcrypt.compareSync(password,this.password);
}


module.exports = User = mongoose.model('user',UserSchema);
