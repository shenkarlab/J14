var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://ohadsas:ohadsas411@ds057954.mongolab.com:57954/j14');
// //var db = mongoose.connect('mongodb://db_user:db_pass@ds047632.mongolab.com:47632/momentapp');
//  mongodb://<dbuser>:<dbpassword>@ds057954.mongolab.com:57954/j14


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
