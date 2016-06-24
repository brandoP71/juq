var express = require('express')
var path = require('path')
var webpack = require('webpack')
var config = require('./webpack.config.development')
var app = express()
var compiler = webpack(config)
var fs = require('fs')
var bodyParser = require('body-parser')
var busboy = require('connect-busboy')

app.set('port', (process.env.PORT || 8000));

app.use(express.static(path.join(__dirname, '/dist')));
app.use(busboy());


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

app.post('/uploadSong', function(req,res) {
  var fstream;
  req.pipe(req.busboy);

  req.busboy.on('file', function (fieldname, file, filename) {
    console.log('Uploading: ' + filename);
    fstream = fs.createWriteStream('assets/' + filename.replace(/[^A-Z0-9_.]+/ig, "_"));
    file.pipe(fstream);
  })
  res.sendStatus(200);
  res.end();
});

app.listen(app.get('port'), function (err) {
  if (err) {
    console.log(err)
  }
  console.info('==> Listening on port %s.', app.get('port'));
})
