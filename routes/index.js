const _ = require('lodash');
const path = require('path');
var express = require('express');
var router = express.Router();
const axios = require('axios');
// Parse Url Request
const bodyParser = require('body-parser');
const multer = require('multer')();
const moment = require('moment');

const DB_PLATFORM = 'platform';
const DB_INFO_PLATFORM = 'infoPlatform';

console.log('AXIOS CALL: ', axios);
axios.defaults.baseURL = 'http://docker_web_1:3000/';

const nano = require('nano')('http://docker_couch_front_1:5984');
nano.db.create(DB_INFO_PLATFORM);
nano.db.create(DB_PLATFORM);
const infoPlatformTable = nano.db.use(DB_INFO_PLATFORM);
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
        const withPort = port ? `:${port}` : '';
        axios.post(`http://${server}${withPort}/info`)
          .then(({data}) => {
            infoPlatformTable.insert({ server: data }, null, (err, body) => {
              if (err) console.log('agregarPlatform[POST].ERROR: ', err);
              res.redirect('/agregarPlataforma');
            });
          }).catch(err => res.render('agregarPlataforma', { title: 'Página de Administración', error: 'No pudo obtener informacion de server' }));
    } 
  });
});

const inputDataFormat = 'YYYY-MM-DD';
// test path: http://localhost:3001/consultas?start_date=2017-10-23T23:59:50.636Z&finish_date=2017-10-24T23:59:50.636Z&
router.get('/consultas', function(req, res, next) {
  let start_date = req.query.start_date ||  "2017-10-23";
  let finish_date = req.query.finish_date ||  "2017-10-24";
  const idHardware = req.query.idHardware;

  const formatStartDate = start_date + 'T00:00:00';
  const formatFinishDate = finish_date + 'T23:59:59';

  axios.post('/info').then((result) => {
    const hardwareInfo = _.keys(result.data.hardware);

    if (idHardware) {
      axios.post('/search', { search: { id_hardware: idHardware, start_date:formatStartDate, finish_date:formatFinishDate } })
        .then(function ({ data }) {
          // console.log('Response server: ', data );
          const dateTimes = _.map(data.data, (date, idx) => moment(idx).format('DD-MM-YYYY HH:mm:ss'));
          const rotateValues = _.map(data.data, (dataObj) => dataObj.sensor);
          res.render('consultas', { title: 'Página de Administración', dateTimes, rotateValues, hardwareInfo, idHardware });
      }).catch(function (error) {
          console.log('Error', error);
      });
    } else res.render('consultas', { title: 'Página de Administración', hardwareInfo });

  }).catch(function (error) {
      console.log('Error', error);
  });
});

router.get('/controlDirecto', function(req, res, next) {
  axios.post('/info').then((result) => {
    const hardwareArray = [];
    _.forEach(result.data.hardware, (hardwareInfo, id) => { if(hardwareInfo.type == 'input') hardwareArray.push(id)  });
    console.log(hardwareArray);
    
    // const hardwareInfo = _.keys(dataInfo);

    res.render('controlDirecto', { title: 'Página de Administración', hardwareArray });
  })
  
  
});

router.post('/controlDirecto', function(req, res, next) {
  const { status, freq, idHardware  } = req.body;
  
  const newStatus = status == 'on';
  console.log('HARDWARE INFO: ', newStatus);
  const paramsObject = {};
  paramsObject[idHardware] = { status: newStatus, freq };

  axios.post('/change', { change: paramsObject } )
    .then((response) => {
      res.redirect('/controlDirecto');
      // res.render('controlDirecto', { title: 'Página de Administración' });
    }).catch(err => {
      console.log('Error', error);
    });
});


module.exports = router;
