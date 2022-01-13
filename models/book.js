const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	title: String,
	ISBN: String,
	
	author: String,
	description: String,
	category: String,
	url: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment",
	}],
});

module.exports = mongoose.model("Book", bookSchema);