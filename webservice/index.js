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
    cloud_name : 'j14',
    api_key : '412388278361816',
    api_secret : 'Rvl3srG9ODTOLyRgD8H9nRg7sk0'
});

function isEmptyObject(obj) {

    if(typeof obj != 'undefined' && obj) {
        return true;
    }
        return false;
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
    var form = new formidable.IncomingForm();

    form.parse(req, function(error, fields, files) {
        console.log('Parsing files from the user');
        dataForm = fields;
            if(isEmptyObject(files) && (files.type == 'image/png' || files.type == 'image/jpeg')){
                console.log("We have an image");
                dataForm.fileType = "imageUploaded";
                ImageSend = true;
            }

        console.log(JSON.stringify(dataForm));
        //save the fields information
    });

    form.on('error', function(err) {
        console.log("in form on error " + err);
    });

    form.on('end', function(error, fields, files) {
        console.log("in end");
        if (ImageSend) {
            var temp_path = this.openedFiles[0].path;
            console.log("dataForm.type " + dataForm.fileType);
            var stream = cloudinary.uploader.upload_stream(function(result) {
                console.log("in result from cloudinary");
                if (isEmptyObject(result.url)) url = result.url;
                console.log("URL : " + url);
                console.log("dataForm " + dataForm.user.userFname);

                usersAction.createMoment(1, true, dataForm.user.userFname,dataForm.user.userLname, dataForm.user.age,
                    dataForm.user.rent11,
                    dataForm.user.rent16,
                    dataForm.user.status11,
                    dataForm.user.status16,
                    dataForm.user.city11,
                    dataForm.user.city16,
                    dataForm.user.happy,
                    dataForm.user.protestSucceed,
                    dataForm.user.government,
                    dataForm.user.socialPressure,
                    dataForm.user.renewProtest,
                    url,
                    "profileImg",
                    dataForm.user.conclusion,
                    "lat",
                    "long", function(files) {
                        if(files){
                            res.status(200).send(JSON.stringify(files));
                        }
                        else{
                            res.status(500);
                        }
                });
            });
            var file_reader = fs.createReadStream(temp_path).pipe(stream);
        } else {
                usersAction.createMoment(1, true ,dataForm.user.userFname,dataForm.user.userLname, dataForm.user.age,
                    dataForm.user.rent11,
                    dataForm.user.rent16,
                    dataForm.user.status11,
                    dataForm.user.status16,
                    dataForm.user.city11,
                    dataForm.user.city16,
                    dataForm.user.happy,
                    dataForm.user.protestSucceed,
                    dataForm.user.government,
                    dataForm.user.socialPressure,
                    dataForm.user.renewProtest,
                    url,
                    "profileImg",
                    dataForm.user.conclusion,
                    "lat",
                    "long",
                    function(files){
                        if(files){
                            res.status(200).send(JSON.stringify(files));
                        }
                        else{
                            res.status(500);
                        }
                });
        }
    });

});
//if (dataForm.fileType == "imageUploaded") {
        //    var temp_path = this.openedFiles[0].path;
        //    console.log("dataForm.type " + dataForm.fileType);
        //    var stream = cloudinary.uploader.upload_stream(function(result) {
        //        console.log("in result from cloudinary");
        //        url = result.url;
        //        console.log("dataForm.album_name " + dataForm.userFname);
        //
        //        usersAction.createMoment(
        //            dataForm.leadRank,
        //            dataForm.adminApproval,
        //            dataForm.userFname,
        //            dataForm.userLname,
        //            dataForm.age,
        //            dataForm.rent11,
        //            dataForm.rent16,
        //            dataForm.status11,
        //            dataForm.status16,
        //            dataForm.city11,
        //            dataForm.city16,
        //            dataForm.happy,
        //            dataForm.protestSucceed,
        //            dataForm.government,
        //            dataForm.socialPressure,
        //            dataForm.renewProtest,
        //            url,
        //            dataForm.userprofileImage,
        //            dataForm.conclusion,
        //            dataForm.tentCoor.latitude,
        //            dataForm.tentCoor.longitude, function(file) {
        //            console.log("In callback image from data base when saving post");
        //            if (file != false) {
        //                usersAction.createMoment(
        //                    dataForm.leadRank,
        //                    dataForm.adminApproval,
        //                    dataForm.userFname,
        //                    dataForm.userLname,
        //                    dataForm.age,
        //                    dataForm.rent11,
        //                    dataForm.rent16,
        //                    dataForm.status11,
        //                    dataForm.status16,
        //                    dataForm.city11,
        //                    dataForm.city16,
        //                    dataForm.happy,
        //                    dataForm.protestSucceed,
        //                    dataForm.government,
        //                    dataForm.socialPressure,
        //                    dataForm.renewProtest,
        //                    url,
        //                    dataForm.userprofileImage,
        //                    dataForm.conclusion,
        //                    dataForm.tentCoor.latitude,
        //                    dataForm.tentCoor.longitude);
        //                res.json({
        //                    "momentType" : "image"
        //                }).status(200);
        //            } else {
        //                res.json({
        //                    "momentError" : "error in upload image to db"
        //                }).status(500);
        //            }
        //        });
        //
        //    });
        //    var file_reader = fs.createReadStream(temp_path).pipe(stream);
        //
        //}

   // });

//});



//
//
//app.post('/map', function(req,res){
//	var Obj = (req.body);
//    console.log(JSON.stringify(Obj));
//    console.log(" req.body !!!!!" + Obj);
//	res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
//	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//	app.set('json spaces',4);
//	res.set("Content-Type", "application/json");
//
//	usersAction.createMoment(
//        Obj.leadRank,
//        Obj.adminApproval,
//        Obj.userFname,
//        Obj.userLname,
//        Obj.age,
//        Obj.rent11,
//        Obj.rent16,
//        Obj.status11,
//        Obj.status16,
//        Obj.city11,
//        Obj.city16,
//        Obj.happy,
//        Obj.protestSucceed,
//        Obj.government,
//        Obj.socialPressure,
//        Obj.renewProtest,
//        Obj.tentImageLink,
//        Obj.userprofileImage,
//        Obj.conclusion,
//        Obj.tentCoor.latitude,
//        Obj.tentCoor.longitude,
//            function(docs){
//                if(docs){
//                    res.status(200).send(JSON.stringify(docs));
//                }
//                else{
//                    res.status(500);
//                }
//        });
//});


app.listen(process.env.PORT || 3000);
console.log("service is listening on port 3000 !!!!!");
