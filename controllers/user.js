'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando'
	});
}


function saveUser(req,res){

	var user = new User();

	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	if(params.password){
		
		// Encrypt password and save data
		bcrypt.hash(params.password, null, null, function(err,hash){
			
			user.password = hash;
			
			if(user.name != null && user.surname != null && user.email != null){
				
				//Save User

				user.save((err,userStored) => {
					if(err){
						res.status(500).send({message: "Something went wrong when saving user"});
					}else{
						if(!userStored){
							res.status(404).send({message: "The user didn't register"});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				});
			}else{
				res.status(200).send({message: "Insert your personal details"});
			}
		});
	}else{
		res.status(200).send({message: "Insert password"});
	}
}
module.exports = {
	pruebas,
	saveUser
};