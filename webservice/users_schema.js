var mongoose = require('mongoose');
var schema = mongoose.Schema;

var usersSchema = new schema({

  campName:{type:String, unique:true},
  centerCoor: [{
    latitude: String,
    longitude: String
  }],
  zoom: Number,
  users: [{
    userId:{type:String, unique:true},
    leadRank: Number,
    adminApproval: Boolean,
    userFname: {type:String, required:true},
    userLname: {type:String, required:true},
    age: String,
    rent11: String,
    rent16: String,
    status11: String,
    status16: String,
    city11: String,
    city16: String,
    happy: String,
    protestSucceed: String,
    government: String,
    socialPressure: String,
    renewProtest: String,
    tentImageLink: String,
    userprofileImage: String,
    conclusion: String,
    tentCoor: [{
      latitude:String,
      longitude:String
    }]
  }]
}, {collection: 'campsnames'});

exports.usersSchema = usersSchema;
