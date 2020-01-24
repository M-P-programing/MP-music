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
				res.status(404).send({message: 'Something went wrong while saving the artist to the db'})
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


module.exports = {
	getArtist,
	saveArtist,
	getArtists
}