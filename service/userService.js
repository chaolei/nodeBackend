/*const mongodb = require("mongodb");
const monk = require("monk");
const db = monk("locahost:27017/test");


let userService = {
	addToCart: function(args){
		var carts = db.get('carts');
		carts.insert(args);
		db.close();
		return {code:1};
	},
	getCartList: function(args){
		let carts = db.get('foo');
		console.log(carts);
		carts.find({}).then(function(docs) {
			console.log(docs);			
		});
		return {code:1};
	}
}*/
require("mongodb");
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/test");

let cart = require("../model/cart");


let userService = {
	addToCart: function(args){
		let Carts = mongoose.model('Carts', cart);
		var cart1 = new Carts(args);
		
		var test = await cart1.save();
		console.log(test);
		
		return test;
	},
	getCartList: function(args){
		let carts = db.get('foo');
		console.log(carts);
		/*carts.find({}).then(function(docs) {
			console.log(docs);			
		});*/
		carts.find({}).then((docs) => {
			db.close();
			console.log(docs);
		})

		return {code:1};
	}
}
module.exports = userService