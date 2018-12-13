require("mongodb");
var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	address: String,
	userID: String,
	title: String,
	content: String,
    picture: String,
    date: String
});