var mongoose = require("mongoose");
var Type = require("./models/type");
var ObjectId = require('mongoose').Types.ObjectId;

//types to be initialized
var data = [
	{

		_id: ObjectId("5A0000000000000000000000"),
		name: "movie",
		fieldList: ["genre", "year", "director", "writers", "stars", "length"],
		fontAweIcon: "film" 
	},
	{
		_id: ObjectId("5A0000000000000000000001"),
		name: "game", 
		fieldList: ["genre","year", "publisher", "platform"],
		fontAweIcon: "gamepad" 
	},
	{
		_id: ObjectId("5A0000000000000000000002"),
		name: "show", 
		fieldList: ["genre", "year", "no. of seasons", "writers", "stars", "creators"],
		fontAweIcon: "tv" 
	},
	{
		_id: ObjectId("5A0000000000000000000003"),
		name: "book", 
		fieldList: ["genre","author", "no. of page", "ISBN", "edition", "publisher"],
		fontAweIcon: "book"  
	},
	{
		_id: ObjectId("5A0000000000000000000004"),
		name: "music album", 
		fieldList: ["genre","performer", "year", "no. of tracks","composer", "length"],
		fontAweIcon: "music" 
	},
	

];

function typeInit(){
   //Remove all types
   Type.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed all type objects");
		 //initialze types
		data.forEach(function(seed){
			Type.create(seed, function(err, type){
				if(err){
					console.log(err);
				} else {
					console.log("added ", type.name);
				}
			});
		});
	}); 

}


module.exports = typeInit;