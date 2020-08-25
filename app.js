var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

const bodyParser = require('body-parser');
const fs = require('fs')
const port = 9090;

require('log-timestamp');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path));

router.use(function (request, response, next) {
  console.log("Request Path: " + request.path + " Request Method: " + request.method);
  next();
});

router.get("/", function(request, response){
  return response.sendFile(path + "submit.html");
});

router.get('/ad', function(request, response) {
  const contents = fs.readFileSync(path + "auctionevents.json", 'UTF-8');
  const rows = contents.split(/\r?\n/);
  
  var schedule = "<html><head><title>Auction Summary</title></head><body><h1>Scheduled Auction Events</h1>"
  schedule += "<table border=\"1\"><tr><th> Title </th><th> Organiser </th><th> Date </th><th> Contact </th></tr>"

  rows.forEach((line) => {
    if (line.length > 0) {
      var auction = JSON.parse(line);
      schedule += "<tr><td> " + auction.title + " </td><td> " + auction.organiser + " </td><td> " + auction.date + " </td><td> " +  auction.contact + " </td></tr>";
    }
  });
  
  schedule += "</table></body></html>"  
  return response.send(schedule);
  
});

router.post('/ad-event', function(request, response) {
  try {
    fs.appendFileSync(path + "auctionevents.json", JSON.stringify(request.body) + "\n");
    var result = "<html><head><title>Submission Acknowledgement</title></head><body><h1>New Auction Event Submitted</h1>"
    result += "<p> Title: " + request.body.title;
    result += "<p> Organiser: " + request.body.organiser;
    result += "<p> Date: " + request.body.date;
    result += "<p> Contact: " + request.body.contact;
    result += "</body></html>";

    return response.send(result);
  }
  catch (err) {
    return console.error(err);
  }

});

app.use("/", router);

app.listen(port, function(){
  console.log("Example app listening on port " + port)
})
