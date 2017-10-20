var express = require('express');
var router = express.Router();
// Parse Url Request
const bodyParser = require('body-parser');
const multer = require('multer')();

const DB_TABLE = 'control';

const nano = require('nano')('http://docker_couch_front_1:5984');
nano.db.create(DB_TABLE);
const controlTable = nano.db.use(DB_TABLE);

express().use(bodyParser.json());
express().use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Página de Administración' });
});

router.get('/agregarPlataforma', function(req, res, next) {
  res.render('agregarPlataforma', { title: 'Página de Administración' });
});

router.get('/consultas', function(req, res, next) {
  res.render('consultas', { title: 'Página de Administración' });
});

router.get('/controlDirecto', function(req, res, next) {
  res.render('controlDirecto', { title: 'Página de Administración' });
});

module.exports = router;
