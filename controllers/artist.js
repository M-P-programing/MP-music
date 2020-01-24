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

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist
}