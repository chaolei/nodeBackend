require("mongodb")
const mongoose = require("mongoose")
const db = mongoose.connect("mongodb://127.0.0.1:27017/test")
mongoose.Promise = global.Promise

let travel = require("../model/travel")
let Travels = mongoose.model('Travels', travel)

/*save travel*/
exports.addTravelInfo = async(ctx) => {
	let travel1 = new Travels(ctx.request.body)
	await new Promise(function(resolve, reject) {
		travel1.save(function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then(async(data) => {
		ctx.body = {'code': 1}
	}, function(err) {
		console.log(err)
		ctx.body = {'code': -1}
	})
}

/*query product in cart*/
exports.getTravelList = async(ctx) => {
	let uid = ctx.query.userID
	await new Promise(function(resolve, reject) {
		Travels.find({userID: uid}).exec(function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then(async(data) => {
		ctx.body = {'code': 1,'dataList': data}
	}, function(err) {
		console.log(err)
		ctx.body = {'code': -1,'dataList': []}
	})
}