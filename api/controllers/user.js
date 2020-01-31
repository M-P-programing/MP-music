'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


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

function loginUser(req,res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) =>{
		if(err){
			res.status(500).send({message: "Database request error"});
		}else{
			if(!user){
				res.status(404).send({message: "User doesn't exist"});
			}else{
				//Check password

				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						//Return user data legged in
						if(params.gethash){
							// Return jwt token
							res.status(200).send({
								token: jwt.createToken(user)
							});

						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: "Wrong password"});
					}
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: "Error while updating user"});
		}else{
			if(!userUpdated){
				res.status(404).send({message: "Something went wrong. User profile wasn't updated."});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
		
	});
}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'Image not uploaded';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ){
			
			User.findByIdAndUpdate(userId, {image: file_name}, (err,userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message: "Something went wrong. User profile wasn't updated."});
				}else{
					res.status(200).send({image:file_name, user: userUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'File extension is not correct'});
		}
	}else{
		res.status(200).send({message: 'No image was uploaded'});
	}
}

function getImageFile(req,res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/' + imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'Image doenst exist'});
		}
	});
}
module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};