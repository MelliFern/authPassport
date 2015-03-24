'use strict';
var bodyparser = require('body-parser');
var User = require('../models/user');

module.exports = function(app, passport, appSecret) {
  app.use(bodyparser.json());
  app.post('/create_user', function(req, res) {
    var newUser = new User();
    newUser.basic.email = req.body.email;
    newUser.basic.password = newUser.generateHash(req.body.password);
    newUser.save(function(err, user) {
      if (err) return res.status(500).send({msg: 'could not create user'});

      user.generateToken(appSecret, function(err, token) {
        if (err) return res.status(500).send({msg: 'could not generate token'});
        res.json({eat: token});
      })
    });
  });

  app.get('/sign_in', passport.authenticate('basic', {session: false}), 
                                                        function(req, res) {
    console.log('in sign_in');                                                          
    req.user.generateToken(appSecret, function(err, token) {
      console.log('in sign_in 2' + token);              
      if (err) return res.status(500).send({msg: 'could not generate token'});
      res.json({eat: token, action:'in sign_in'});
    })
  });
};