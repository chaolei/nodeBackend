require("mongodb")
const mongoose = require("mongoose")
const db = mongoose.connect("mongodb://127.0.0.1:27017/test")
mongoose.Promise = global.Promise

let cart = require("../model/cart")
let Carts = mongoose.model('Carts', cart)

/*add product to cart*/
exports.addToCart = async(ctx) => {
	let cart1 = new Carts(ctx.request.body)
	await new Promise(function(resolve, reject) {
		cart1.save(function(err, data) {
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
exports.getCartList = async(ctx) => {
	let uid = ctx.query.userID
	await new Promise(function(resolve, reject) {
		Carts.find({userID: uid}).exec(function(err, data) {
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
		ctx.body = {'code': -1,'dataList': null}
	})
}

/*delete one product from cart*/
exports.deleteOneCart = async(ctx) => {
	let id = ctx.query._id
	await new Promise(function(resolve, reject) {
		Carts.remove({_id: id}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})
	}).then(async(data) => {
		ctx.body = {'code': 1}
	}, function(err) {
		console.log(err)
		ctx.body = {'code': -1}
	})
}

/*delete all product from cart*/
exports.deleteAllCart = async(ctx) => {
	let uid = ctx.query.userID
	await new Promise(function(resolve, reject) {
		Carts.remove({userID: uid}, function(err, data) {
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