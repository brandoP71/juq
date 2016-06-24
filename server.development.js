var express = require('express')
var path = require('path')
var webpack = require('webpack')
var config = require('./webpack.config.development')
var app = express()
var compiler = webpack(config)
var fs = require('fs')
var bodyParser = require('body-parser')
var busboy = require('connect-busboy')

var middleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

app.use(middleware);
app.use(busboy());
app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('*', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
  res.end();
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

app.use(express.static(path.join(__dirname, '/dist')))

app.listen(config._hotPort, 'localhost', function (err) {
  if (err) {
    console.log(err)
  }
  console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', config._hotPort, config._hotPort)
})
