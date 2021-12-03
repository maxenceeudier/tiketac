var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

var journeyModel = require("../models/journeys");
var userModel = require("../models/users");
var ordersModel = require("../models/orders");
var empty = false;

// useNewUrlParser ;)

// --------------------- BDD -----------------------------------------------------
var city = [
  "Paris",
  "Marseille",
  "Nantes",
  "Lyon",
  "Rennes",
  "Melun",
  "Bordeaux",
  "Lille",
];
var date = [
  "2018-11-20",
  "2018-11-21",
  "2018-11-22",
  "2018-11-23",
  "2018-11-24",
];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* Sécurisation pages home&basket&journey */
router.get("/home", async function (req, res, next) {
  if (!req.session.userSession) {
    res.redirect("/");
  }
  res.render("home");
});

// Remplissage de la base de donnée, une fois suffit
router.get("/save", async function (req, res, next) {
  // How many journeys we want
  var count = 300;

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {
    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))];
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))];

    if (departureCity != arrivalCity) {
      var newUser = new journeyModel({
        departure: departureCity,
        arrival: arrivalCity,
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });

      await newUser.save();
    }
  }
  res.render("index");
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get("/result", function (req, res, next) {
  // Permet de savoir combien de trajets il y a par ville en base
  for (i = 0; i < city.length; i++) {
    journeyModel.find(
      {
        departure: city[i],
      }, //filtre

      function (err, journey) {
        console.log(
          `Nombre de trajets au départ de ${journey[0].departure} : `,
          journey.length
        );
      }
    );
  }

  res.render("index", {
    title: "Express",
  });
});

router.get("/basket", async function (req, res, next) {
  if (!req.session.userSession) {
    res.redirect("/");
  }

  if (typeof req.session.dataJourney == "undefined") {
    req.session.dataJourney = [];
  }

  if (req.query.cities != null) {
    req.session.dataJourney.push({
      journey: req.query.cities,
      date: req.query.date,
      departureTime: req.query.hour,
      passenger: `${req.query.lastname} ${req.query.firstname}`,
      price: parseInt(req.query.price),
      id: req.query.id,
    });
  }

  if (req.session.dataJourney.length === 0) {
    empty = true;
  }

  res.render("basket", {
    dataJourney: req.session.dataJourney,
    empty,
  });
});

/****** JOURNEY ******/
router.post("/journey", async function (req, res, next) {
  if (!req.session.userSession) {
    res.redirect("/");
  }

  // fonction pour mettre les villes au bon format
  var formatCities = (citie) => {
    citie.toLowerCase();
    var firstLetter = citie[0].toUpperCase();
    var restWord = citie.slice(1);
    citie = `${firstLetter}${restWord}`;
    /* console.log(citie); */
    return citie;
  };

  var date = new Date(req.body.date);
  var departure = formatCities(req.body.departure);
  var arrival = formatCities(req.body.arrival);
  var journey = await journeyModel.find({
    departure: departure,
    arrival: arrival,
    date: date,
  });

  var user = req.session.userSession;
  console.log(user);

  if (journey.length !== 0) {
    res.render("journey", {
      journey,
      user,
    });
  } else {
    res.render("noJourney");
  }
});

/****** DELETE JOURNEY BASKET ******/
router.get("/delete-journey", function (req, res, next) {
  if (!req.session.userSession) {
    res.redirect("/");
  }

  req.session.dataJourney.splice(req.query.position, 1);

  if (req.session.dataJourney.length === 0) {
    empty = true;
  }

  res.render("basket", { dataJourney: req.session.dataJourney, empty });
});

/****** DECONNEXION ******/
router.get("/deconnection", async function (req, res, next) {
  req.session.userSession = null;

  res.redirect("/");
});

/****** LASTRIPS ******/
router.get("/lastTrips", async function (req, res, next) {
  if (!req.session.userSession) {
    res.redirect("/");
  }

  if (typeof req.session.dataJourney == "undefined") {
    req.session.dataJourney = [];
  }

  for (let i = 0; i < req.session.dataJourney.length; i++) {
    if (req.session.dataJourney.length != 0) {
      var order = new ordersModel({
        userId: req.session.userSession.id,
        ordersId: req.session.dataJourney[i].id,
      });
    }

    orderSaved = await order.save();
  }

  res.render("basket", {
    dataJourney: req.session.dataJourney,
    empty,
  });
});

router.get("/mylasttrips", async function (req, res, next) {
  if (!req.session.userSession) {
    res.redirect("/");
  }

  var orderUser = await ordersModel.find({
    userId: req.session.userSession.id,
  });
  console.log(orderUser);
  var historique = [];
  for (let i = 0; i < orderUser.length; i++) {
    historique.push(await journeyModel.findById(`${orderUser[i].ordersId}`));
  }
  console.log(historique);

  res.render("lastTrips", { historique });
});

module.exports = router;
