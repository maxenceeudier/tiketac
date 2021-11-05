var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var cityModel = require('../models/journeys')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/sign-up', async function (req, res, next) {
  var userIdent = await userModel.findOne({email: req.body.email});
  if(!userIdent && req.body.name != null && req.body.firstname != null && req.body.email != null && req.body.password != null){
    var newUser = new userModel({
      lastname: req.body.name,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
    });
    var newUserSaved = await newUser.save();
    req.session.userSession = {
      lastname: newUserSaved.lastname,
      firstname: newUserSaved.firstname,
      id: newUserSaved.id
    };
    console.log(req.session.userSession);
    res.redirect('/home');
  }else{
    res.redirect('/')
  }
})

router.post('/sign-in', async function (req, res, next){
var userExist = await userModel.findOne({email: req.body.email, password: req.body.password});
if(userExist && req.body.email != null && req.body.password !=null){
req.session.userSession = {
  lastname: userExist.lastname,
  firstname: userExist.firstname,
  id: userExist.id
};
console.log('already exist');
    res.redirect('/home');
}else{
  console.log("Doesn't exist");
    res.redirect('/');
};
})


module.exports = router;
