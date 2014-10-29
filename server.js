var express = require('express');
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');
var morgan = require('morgan');
var bodyParser = require('body-parser'); // to work with POST requests
//var routes=require('');

var app = express();

//exp4.0 addition
var rou = express.Router();

//environment variables
// Listen
app.set('port', process.env.PORT || 3060);
app.set('views', path.join(__dirname, 'server/views'));

//rendering html files in place of default ejs
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(morgan('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

// development only
var env = process.env.NODE_ENV || 'development';
if ('development' == app.get('env')) {
    //app.use(express.errorHandler());
}
app.get('/', function(req, res, next) {

    res.render("index.html");
});


app.get('*', function(req, res) {
    res.sendfile('./server/views/index.html');
});

app.post('/', function(req, res, next) {
    
    var valueRcvd = req.body.data;
    if (req.body.data == '') {
        console.log('request.user is not truthy');
        res.send(400, 'There was no input, Please enter a json string');
    } else {

        var dataRecevd = req.body.data;
        //parsing input to String
        if (dataRecevd) {
            console.log('if dataRecevd');
            try {

                var data = JSON.parse(dataRecevd);
            } catch (e) {
                res.send(400, '{"error":"Could not decode request:JSON parsing failed"}');
            }
        }
        var noOfObjects = data.payload.length;
        console.log('noOfObjects' + noOfObjects);
        var countOfResp = 0;
        var responseGenerated = {};
        var response = [];
        responseGenerated.response = response;

        for (var i = 0; i < data.payload.length; i++) {

            var componentFieldGrp = data.payload[i];
            console.log(componentFieldGrp);
            if (componentFieldGrp.drm == true && componentFieldGrp.episodeCount > 0) {
                console.log('drm is true for above data');

                console.log('countOfResp' + countOfResp);
                var valueEntered = {
                    "image": componentFieldGrp.image.showImage,
                    "slug": componentFieldGrp.slug,
                    "title": componentFieldGrp.title
                };
                responseGenerated.response.push(valueEntered);
                countOfResp = countOfResp + 1;
            }
        }

        var finalResp = responseGenerated;
        console.log('finalResp' + finalResp);
    }

    //res.resp = finalResp;
    res.set('Content-Type', 'application/json');
    res.json(finalResp);


});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});