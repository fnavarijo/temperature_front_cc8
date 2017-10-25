const _ = require('lodash');
const path = require('path');
var express = require('express');
var router = express.Router();
const axios = require('axios');
// Parse Url Request
const bodyParser = require('body-parser');
const multer = require('multer')();

const DB_PLATFORM = 'platform';
const DB_TABLE = 'control';

console.log('AXIOS CALL: ', axios);
axios.defaults.baseURL = 'http://docker_web_1:3000/';

const nano = require('nano')('http://docker_couch_front_1:5984');
nano.db.create(DB_TABLE);
nano.db.create(DB_PLATFORM);
const controlTable = nano.db.use(DB_TABLE);
const platformTable = nano.db.use(DB_PLATFORM);

express().use(bodyParser.json());
express().use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Página de Administración' });
});

router.get('/agregarPlataforma', function(req, res, next) {
  res.render('agregarPlataforma', { title: 'Página de Administración' });
});

// Store plaltform
router.post('/agregarPlataforma', function(req, res, next) {
  const { server, port } = req.body;
  const date = new Date();
  platformTable.insert({ server, port, date }, null, (err, body) => {
    if (err) {
        console.log(err);
        res.status(500).send(err);
    } else {
        console.log(req);
        res.redirect('/agregarPlataforma');
    } 
  });
});

// test path: http://localhost:3001/consultas?start_date=2017-10-23T23:59:50.636Z&finish_date=2017-10-24T23:59:50.636Z&
router.get('/consultas', function(req, res, next) {
  let start_date = req.query.start_date ||  "2017-10-23T23:59:50.636Z";
  let finish_date = req.query.finish_date ||  "2017-10-24T23:59:50.636Z";
  console.log('PARAM QUERY; ', start_date, finish_date);
  axios.post('/search', { search: { id_hardware: "id01", start_date, finish_date } })
    .then(function ({ data }) {
      const dateTimes = _.map(data.data, (dataObj) => _.keys(dataObj)[0]);
      const rotateValues = _.map(data.data, (dataObj) => _.values(dataObj)[0].rotation);
      console.log('Response server: ', dateTimes );
      res.render('consultas', { title: 'Página de Administración', dateTimes, rotateValues });
  }).catch(function (error) {
      console.log('Error', error);
  });
  
});

router.get('/controlDirecto', function(req, res, next) {
  res.render('controlDirecto', { title: 'Página de Administración' });
});

router.post('/controlDirecto', function(req, res, next) {
  const { rotation } = req.body;
  axios.post('/change', { change: { "id01": { rotation, date: new Date() } } } )
    .then((response) => {
      res.redirect('/controlDirecto');
      // res.render('controlDirecto', { title: 'Página de Administración' });
    }).catch(err => {
      console.log('Error', error);
    });
});

module.exports = router;
