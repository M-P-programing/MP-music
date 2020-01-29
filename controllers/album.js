'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req,res){
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err,album) =>{
		if(err){
			res.status(500).send({message: 'Request error'});
		}else{
			if(!album){
				res.status(404).send({message: 'No album found'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function saveAlbum(req,res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	console.log(params);

	album.save((err,albumStored) =>{
		if(err){
			res.status(500).send({message: 'Error connecting to server'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'Album wasnt saved in the database'});
			}else{
				res.status(200).send({album:albumStored});
			}
		}
	});

}

function getAlbums(req,res){
	var artistId = req.params.artist;

	if(!artistId){
		// Get all albums from db

		var find = Album.find({}).sort('title');
	}else{
		// Get albums just from artist id
		
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path: 'artist'}).exec((err,albums)=>{
		if(err){
			res.status(500).send({message: 'Error connecting to server'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No albums found'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}

function updateAlbum(req,res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err,albumUpdated) => {
		if(err){
			res.status(500).send({message:'Server error'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message:'Album wasn\'t updated'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req,res){
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId, (err,albumRemoved)=>{
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
							res.status(200).send({album:albumRemoved});
						}
					}
				});
			}
		}
	});
}

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum
};