'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){

	var artistId = req.params.id;

	Artist.findById(artistId, (err,artist) =>{
		if(err){
			res.status(500).send({message: "Database request error"});
		}else{
			if(!artist){
				res.status(500).send({message: "The artist doesn\'t exist"});
			}else{
				res.status(200).send({artist});
			}
		}
	});
	
}

function saveArtist(req,res){
	var artist = new Artist;

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = "null";

	artist.save((err,artistStored) =>{
		if(err){
			res.status(500).send({message: 'Error saving artist'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'Something went wrong while saving the artist to the db'});
			}else{
				res.status(200).send({artist:artistStored});
			}
		}
	});
}

function getArtists(req,res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err,artists,total){
		if(err){
			res.status(500).send({message: 'Something went wrong...'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No artists found'});
			}else{
				return res.status(200).send({
					total_items:total,
					artists:artists
				});
			}
		}
	});
}

function updateArtist(req,res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error updating artist'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'Something went wrong while updating the artist to the db'})
			}else{
				res.status(200).send({artist:artistUpdated});
			}
		}
	});
}

function deleteArtist(req,res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error deleting artist'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'Something went wrong while deleting the artist from the db'});
			}else{
				Album.find({artist:artistRemoved._id}).remove((err,albumRemoved)=>{
					if(err){
						res.status(500).send({message: 'Error deleting artist albums'});
					}else{
						if(!albumRemoved){
							res.status(404).send({message: 'Something went wrong while deleting the artist albums from the db'});
						}else{
							Song.find({album:albumRemoved._id}).remove((err,songRemoved)=>{
								if(err){
									res.status(500).send({message: 'Error deleting albums song'});
								}else{
									if(!songRemoved){
										res.status(404).send({message: 'Something went wrong while deleting the albums songs from the db'});
									}else{
										res.status(200).send({artist:artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'Image not uploaded';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ){
			
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err,artistUpdated) => {
				if(!artistUpdated){
					res.status(404).send({message: "Something went wrong. Artist profile wasn't updated."});
				}else{
					res.status(200).send({artist: artistUpdated});
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
	var path_file = './uploads/artists/' + imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'Image doenst exist'});
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}