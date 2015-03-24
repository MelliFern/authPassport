'use strict';
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
module.exports={
startServer: function (){
			mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/week8_project');

			var app = express();
			app.use(express.static(__dirname+ '/build'));
			app.set('appSecret', process.env.SECRET || 'changethischangethis!');
			app.use(passport.initialize());
			require('./server/lib/passport_strat')(passport);
			var userRouter = express.Router();

			require('./server/routes/user_routes')(userRouter, passport, app.get('appSecret'));

			app.use('/api/v1', userRouter);
			app.listen(process.env.PORT || 3000, function() {
			  console.log('server listening on port ' + (process.env.PORT || 3000));
			});
		}
}


