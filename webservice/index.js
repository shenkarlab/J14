/* create express instance and listen to port 8080 */
/* DONOT forget (cmd, at project folder): $npm install express -- save */
var express = require('express');
var app = express();
app.use('/', express.static('./public'));
var usersAction = require('./usersActionsController');
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());
app.use(bodyParser());

app.get('/get', function(req,res){
	console.log("out Docs :" + usersAction.getData());
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);
	res.json(usersAction.getData());
});

app.post('/map', function(req,res){
	var Obj = (req.body);
    console.log(JSON.stringify(Obj));
    console.log(" req.body !!!!!" + Obj);
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE','OPTIONS');
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	usersAction.createMoment(
        Obj.leadRank,
        Obj.adminApproval,
        Obj.userFname,
        Obj.userLname,
        Obj.age,
        Obj.rent11,
        Obj.rent16,
        Obj.status11,
        Obj.status16,
        Obj.city11,
        Obj.city16,
        Obj.salaryIncreased,
        Obj.happy,
        Obj.protestSucceed,
        Obj.government,
        Obj.socialPressure,
        Obj.renewProtest,
        Obj.tentImageLink,
        Obj.userprofileImage,
        Obj.conclusion,
        Obj.tentCoor.latitude,
        Obj.tentCoor.longitude,
        function(err, docs){
        if(docs){
            res.status(200);
            return res.send(JSON.stringify(docs));
		}
		else{
			res.status(500).send(err);
		}
	});
});



app.listen(process.env.PORT || 3000);
console.log("service is listening on port 3000 !!!!!");
