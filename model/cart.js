require("mongodb");
var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	nums:String,
	userID:String,
	proId:String
});