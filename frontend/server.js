var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var fs = require('fs');
var compression = require('compression')
let port = process.env.PORT || 443;


var app = express();
var compiler = webpack(config);

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


// healthy check from ELB 
app.get('/ping', function (req, res) {
  log.Info('Receive healthcheck /ping from ELB - ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': 2
  });
  res.write('OK');
  res.end();
});



app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});



var privateKey = fs.readFileSync('./cert/star_pandotoken_org.key');
var certificate = fs.readFileSync('./cert/star_pandotoken_org.crt');
var options = {
  key: privateKey,
  cert: certificate
};
var https = require('http').createServer(app);


https.listen(port, function (err) {
  if (err) {
    return;
  }

});
