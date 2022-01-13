const express = require("express"),
	mongoose = require("mongoose"),
	multer = require("multer"),
	router = express.Router();


var picSchema = new mongoose.Schema({
	picpath: String
})
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
var upload = multer({ storage: storage })


var picModel = mongoose.model('picsdemo', picSchema);
// Importing controller
const bookController = require('../controllers/books');

// Browse books
router.get("/books/:filter/:value/:page", bookController.getBooks);

// Fetch books by search value
router.post("/books/:filter/:value/:page", bookController.findBooks);

// Fetch individual book details
router.get("/books/details/:book_id", bookController.getBookDetails);
router.get('/books/dow', (req, res) => {
	picModel.find((err, data) => {
		if (err) {
			console.log(err)
		}
		else if (data.length > 0) {
			res.render('home', { data: data })
		}
		else {
			res.render('home', { data: {} })
		}
	})
})

router.post('/books/upload', upload.single('pic'), (req, res) => {
	var x = 'uploads/' + req.file.originalname;
	var temp = new picModel({
		picpath: x
	})
	temp.save((err, data) => {
		if (err) {
			console.log(err)
		}
		res.redirect('/')
	})
})
router.get('/books/download/:id', (req, res) => {
	picModel.find({ _id: req.params.id }, (err, data) => {
		if (err) {
			console.log(err)
		}
		else {
			var x = __dirname + '/public/' + data[0].picpath;
			res.download(x)
		}
	})
})


module.exports = router;