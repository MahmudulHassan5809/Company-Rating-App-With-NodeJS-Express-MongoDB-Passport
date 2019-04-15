const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const MessageSchema = new Schema({
  body:{
    type: String,
    required: [true,'Please Write Something']
  },
  userFrom:  { type: Schema.Types.ObjectId,ref: 'user'},
  userTo:  { type: Schema.Types.ObjectId,ref: 'user'},
  userFromName:  { type: String,required: true},
  userToName:  { type: String,required: true},
  date:{
    type: Date,
    default: Date.now
  }
});


module.exports = Message = mongoose.model('message',MessageSchema);
