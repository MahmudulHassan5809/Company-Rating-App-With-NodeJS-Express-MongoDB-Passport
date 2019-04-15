const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const CompanySchema = new Schema({
  name:{
    type: String,
     required: [true,'Please Provide A Company Name']
  },
  address:{
    type: String,
    required: [true,'Please Provide Address']
  },
  city:{
    type: String,
    required: [true,'Please Provide City']
  },
  country:{
    type: String,
    required: [true,'Please Provide Country']
  },
  sector:{
    type: String,
    required: [true,'Please Provide Sector']
  },
  website:{
    type: String,
    required: [true,'Please Provide Website']
  },
  image:{
    type: String,
    default: '/uploads/defaultPic.png'
  },
  employees: [{
    employee:  { type: Schema.Types.ObjectId,ref: 'user'},
  }],
  companyRatings: [{
    companyName : { type: String, default: ''},
    userFullName: {type: String, default: ''},
    userRole: {type: String, default: ''},
    companyImage: {type: String, default: ''},
    userRating: {type: Number, default: 0},
    userReview: {type: String, default: ''},
  }],
  ratingNumber: [Number],
  ratingSum : {type: Number, default: 0},
  date:{
    type: Date,
    default: Date.now
  }
});




module.exports = Company = mongoose.model('company',CompanySchema);
