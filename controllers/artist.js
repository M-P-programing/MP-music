'use strict'

var path = require('path');
var fs = require('fs');

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
				res.status(404).send({message: 'Something went wrong while saving the artist to the db'})
			}else{
				res.status(200).send({artist:artistStored});
			}
		}
	});
}


module.exports = {
	getArtist,
	saveArtist
}