var mongoose = require('mongoose');
var schema = mongoose.Schema;

var usersSchema = new schema({

campName: {type:String, required:true},
centerCoor: [{
  latitude:{type:Number},
  longitude:{type:Number}
}],
zoom: {type:String},
users: [{
	leadRank: {type:Number},
  adminApproval: Boolean,
  userId: {type:Number, required:true, unique:true},
  userprofileImage: {type:String},
  userFname: {type:String, required:true},
  userLname: {type:String, required:true},
  age: {type:Number},
  rent11: {type:Number},
  rent16: {type:Number},
	status11: {type:String},
  status16: {type:String},
  occupation11: {type:String},
  occupation16: {type:String},
  salaryIncreased: {type:String},
  happy: {type:Boolean},
  whatIDid: {type:String},
  protestSucceed: {type:Boolean},
  regrets: {type:Boolean},
  government: {type:Boolean},
  socialPressure: {type:Boolean},
  renewProtest: {type:Boolean},
  tentImageLink: {type:String},
  conclusion: {type:String},
  tentCoor: [{
    latitude:{type:Number},
    longitude:{type:Number}
  }],

}]
}, {collection: 'camps'});

exports.usersSchema = usersSchema;
