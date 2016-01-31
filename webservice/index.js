/* create express instance and listen to port 8080 */
/* DONOT forget (cmd, at project folder): $npm install express -- save */
var express = require('express');
var app = express();
var fs = require('fs');
var formidable = require('formidable');
util = require('util');
var cloudinary = require('cloudinary');
var url = "http://s11.postimg.org/ypkjkrdz7/album.png";

app.use('/', express.static('./public'));
var usersAction = require('./usersActionsController');
var bodyParser = require('body-parser');
var cors = require('cors');
var ImageSend = false;
app.use(cors());
app.use(bodyParser());

cloudinary.config({
    cloud_name : 'bj14',
    api_key : '978444816297389',
    api_secret : '-qimhf9n3Wd9YobcOUXQOIA4CE8'
});

function isEmptyObject(obj) {

    if(typeof obj != 'undefined' && obj) {
        return false;
    }
        return true;
}


app.get('/get', function(req,res){
	console.log("out Docs :" + usersAction.getData());
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);
	res.json(usersAction.getData());
});

app.post('/map', function(req, res) {

    var Obj = (req.body);
    console.log(JSON.stringify(Obj));
    console.log("req.body !!!!!" + Obj);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    app.set('json spaces',4);
    res.set("Content-Type", "application/json");
    var dataForm = {};
    var dataFile = {};
    var form = new formidable.IncomingForm();

    form.parse(req, function(error, fields,files) {
        console.log('Parsing files from the user');

        dataForm = fields;
        dataFile = JSON.stringify(files);
        console.log(" FILESSSSS " + JSON.stringify(dataForm));
        console.log(" DATA FILE " + dataFile);

        if(!isEmptyObject(files)){
                console.log("We have an image");
                ImageSend = true;
            }
        //save the fields information
    });

    form.on('error', function(err) {
        console.log("in form on error " + err);
    });

    form.on('end', function(error, fields, files) {
        console.log("in end");
        if (ImageSend) {
            var temp_path = this.openedFiles[0].path;
            var stream = cloudinary.uploader.upload_stream(function(result) {
                console.log("in result from cloudinary");
                //dataForm = fields;
                console.log("RESULT " + JSON.stringify(result));

                if (!isEmptyObject(result.url)) url = result.url;
                console.log("URL : " + url);
                console.log("dataForm " + dataForm["user[age]"]);

                usersAction.createMoment(1, true, dataForm["user[fn]"],dataForm["user[ln]"], dataForm["user[age]"],
                    dataForm["user[r11]"],
                    dataForm["user[r16]"],
                    dataForm["user[s11]"],
                    dataForm["user[s16]"],
                    dataForm["user[c11]"],
                    dataForm["user[c16]"],
                    dataForm["user[happy]"],
                    dataForm["user[success]"],
                    dataForm["user[gov]"],
                    dataForm["user[pressure]"],
                    dataForm["user[renew]"],
                    url,
                    "profileImg",
                    dataForm["user[conc]"],
                    dataForm["lan"],
                    dataForm["lat"], function(docs) {
                        if(docs){
                            res.status(200).send(JSON.stringify(docs));
                        }
                        else{
                            res.status(500);
                        }
                });
            });
            var file_reader = fs.createReadStream(temp_path).pipe(stream);
        } else {
            console.log("No IMAGE");
                usersAction.createMoment(1, true ,dataForm["user[fn]"],dataForm["user[ln]"], dataForm["user[age]"],
                    dataForm["user[r11]"],
                    dataForm["user[r16]"],
                    dataForm["user[s11]"],
                    dataForm["user[s16]"],
                    dataForm["user[c11]"],
                    dataForm["user[c16]"],
                    dataForm["user[happy]"],
                    dataForm["user[success]"],
                    dataForm["user[gov]"],
                    dataForm["user[pressure]"],
                    dataForm["user[renew]"],
                    url,
                    "profileImg",
                    dataForm["user[conc]"],
                    dataForm["lan"],
                    dataForm["lat"], function(docs) {
                        if(docs){
                            res.status(200).send(JSON.stringify(docs));
                        }
                        else{
                            res.status(500);
                        }
                });
        }
    });

});


app.listen(process.env.PORT || 3000);
console.log("service is listening on port 3000 !!!!!");
