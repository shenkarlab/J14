var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://ohadsas:ohadsas411@ds057954.mongolab.com:57954/j14');

var usersSchema  = require('./users_schema').usersSchema;
mongoose.model('usersM', usersSchema);
var usersAction;

mongoose.connection.once('open',function(){
	var Users = this.model('usersM');
	var query = Users.find();
	query.where('userId');

query.exec(function(err, docs){
	usersAction = docs;
	console.log("docs: " + usersAction);
	return usersAction;
	});
});

exports.getData = function(){
	return usersAction;
};


exports.createMoment = function(_fn, _ln, _age, _st11,_st16 ,_c11,_c16,_r11,_r16,_sal,_happy,_protestSucceed,_gov,_social,_renew,_conc,_lan,_lat,cb) {
    console.log(_fn, _ln, _age, _st11, _st16, _c11, _c16, _r11, _r16, _sal, _happy, _protestSucceed, _gov, _social, _renew, _conc, _lan, _lat);
    var Users = mongoose.model('usersM');
    console.log("createMoment Called");
    Users.findOne({
        'campName': "Rothschilds"
    }, null, function (err, data) {
        data.users.push({
            'userId': mongoose.Types.ObjectId(),
            'leadRank': 1,
            'adminApproval': true,
            'userFname': _fn,
            'userLname': _ln,
            'age': _age,
            'rent11': _r11,
            'rent16': _r16,
            'status11': _st11,
            'status16': _st16,
            'city11': _c11,
            'city16': _c16,
            'salaryIncreased': _sal,
            'happy': _happy,
            "protestSucceed": _protestSucceed,
            "government": _gov,
            "socialPressure": _social,
            "renewProtest": _renew,
            "conclusion": _conc,
            'tentCoor': {'latitude': _lat, 'longitude': _lan}
        });
        data.save();
        console.log(err + "ERR");
        console.log(data + "OK Success");
        cb(err, data);
    });
};




//exports.createMoment = function(_fn, _ln, _age, _st11,_st16 ,_c11,_c16,_r11,_r16,_sal,_happy,_protestSucceed,_gov,_social,_renew,_conc,_lan,_lat,cb)
//{
//    console.log(_fn, _ln, _age, _st11,_st16 ,_c11,_c16,_r11,_r16,_sal,_happy,_protestSucceed,_gov,_social,_renew,_conc,_lan,_lat);
//    var Users = mongoose.model('usersM');
//    console.log("createMoment Called");
//    Users.create({
//        'campName': "Rothschild",
//        'centerCoor': [
//            {
//                "latitude": "32.066824",
//                "longitude": "34.777816"
//            }],
//        'zoom': 13,
//        'users': [{
//            'userId' : mongoose.Types.ObjectId(),
//            'leadRank':1,
//            'adminApproval':true,
//            'userFname':_fn,
//            'userLname':_ln,
//            'age':_age,
//            'rent11':_r11,
//            'rent16':_r16,
//            'status11':_st11,
//            'status16':_st16,
//            'city11':_c11,
//            'city16':_c16,
//            'salaryIncreased':_sal,
//            'happy':_happy,
//            "protestSucceed": _protestSucceed,
//            "government": _gov,
//            "socialPressure": _social,
//            "renewProtest": _renew,
//            "conclusion":_conc,
//            'tentCoor':{'latitude' : _lat, 'longitude' : _lan}
//        }]
//    }, null, function(err, result) {
//        console.log("Inserted a document into the users collection.");
//        console.log("ERROR :" + err);
//        console.log("RESULT :" + result);
//
//        cb(err, result);
//    });
//};
