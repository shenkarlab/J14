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
    mongoose.disconnect();
	return usersAction;
	});
});

exports.getData = function(){
	return usersAction;
};

exports.createMoment = function(_fn, _ln, _age, _st11,_st16 ,_c11,_c16,_r11,_r16,_sal,_happy,_protestSucceed,_gov,_social,_renew,_conc,_lan,_lat,callback) {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://ohadsas:ohadsas411@ds057954.mongolab.com:57954/j14');
    var usersSchema  = require('./users_schema').usersSchema;
    mongoose.model('usersM', usersSchema);

    mongoose.connection.once('open', function() {
        var Users = this.model('usersM');

        var query = {
            'campName': "Rothschilds"
        };
        var doc = {
            $push : {
                'users' : {
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
                    'happy': _happy,
                    "protestSucceed": _protestSucceed,
                    "government": _gov,
                    "socialPressure": _social,
                    "renewProtest": _renew,
                    "tentImageLink": "link for tent image",
                    "userprofileImage": "link for profile image",
                    "conclusion": _conc,
                    'tentCoor': {'latitude': _lat, 'longitude': _lan}
                }
            }
        };
        var options = {
            upsert : true
        };
        Users.findOneAndUpdate(query, doc, options, function(err, results) {
            if (err) {
                mongoose.disconnect();
                console.log("didnt found camp in that name!");
                callback(false);
            } else {
                console.log("results ", results);
                mongoose.disconnect();
                callback(results);
            }
        });

    });
};
