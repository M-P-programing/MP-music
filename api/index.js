'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 7777;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err,res) =>{
	if(err){
		throw err;
	}else{
		console.log('The database connection is working correctly!');

		app.listen(port, function(){
			console.log('Server running in http://localhost:' + port);
		})
	}
});