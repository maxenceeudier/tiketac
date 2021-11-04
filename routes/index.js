var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

var journeyModel = require('../models/journeys');
var userModel = require('../models/users')
var  journeyExist = true;

// useNewUrlParser ;)

// --------------------- BDD -----------------------------------------------------




var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index');
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});


router.get('/home',function(req,res,next){
  res.render('home',{journeyExist});
});

router.post('/journey',async function(req,res,next){
  
  var date = new Date(req.body.date);
  var departure = req.body.departure;
  var arrival = req.body.arrival;
  var journey = await journeyModel.find({departure:departure,arrival:arrival,date:date});

 
  if (journey.length !== 0 ){
   

    res.render('journey',{journey});
  }else{
    journeyExist = false;
  res.redirect('/home')
  }
  
});

module.exports = router;
