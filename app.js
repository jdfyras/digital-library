const express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	session = require("express-session"),
	passport = require("passport"),
	multer = require("multer"),
	uid = require("uid"),
	path = require("path"),
	sanitizer = require("express-sanitizer"),
	methodOverride = require("method-override"),
	localStrategy = require("passport-local"),
	MongoStore = require("connect-mongodb-session")(session),
	flash = require("connect-flash"),
	User = require("./models/user"),
	userRoutes = require("./routes/users"),
	adminRoutes = require("./routes/admin"),
	bookRoutes = require("./routes/books"),
	authRoutes = require("./routes/auth"),
	fs = require("fs"),
	{ google } = require("googleapis");

// const Seed = require('./seed');
const CLIENT_ID = '443772158501-gl7ap33cbs8skua2mvtjru71rmi7hf7b.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04MmzAJ1waE2PCgYIARAAGAQSNwF-L9IrHhOCZr3eszVlYaRLbNLau7cu5e6gilhQaZ1Ta8YlqRaX71nA8Jc1cFfrHmB8_KmYAoE'
const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
	version: 'v3',
	auth: oauth2Client,
});
const filePath = path.join(__dirname, 'a.pdf');

async function uploadFile() {
	try {
		const response = await drive.files.create({
			requestBody: {
				name: 'a.pdf', //This can be name of your choice
				mimeType: 'application/pdf',
			},
			media: {
				mimeType: 'application/pdf',
				body: fs.createReadStream(filePath),
			},
		});

		console.log(response.data);
	} catch (error) {
		console.log(error.message);
	}
}
app.get("/up", async (req, res) => {
	var b=await uploadFile
	res.json(b)

})
// uncomment below line for first time to seed database;
// Seed(1000);

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// app config
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use('/documents', express.static(path.join(__dirname, 'documents')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitizer());

// db config
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log("MongoDB is connected"))
	.catch((error) => console.log(error));

//upload-download CONFIGURATION


var pathh = path.resolve(__dirname, 'public');
app.use(express.static(pathh));





//PASSPORT CONFIGURATION

const store = new MongoStore({
	uri: process.env.DB_URL,
	collection: "sessions",
});

app.use(
	session({
		//must be declared before passport session and initialize method
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		store,
	})
);

app.use(flash());

app.use(passport.initialize()); //must declared before passport.session()
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// configure image file storage
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, `${uid()}-${file.originalname}`);
	},
});

const filefilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(
	multer({ storage: fileStorage, fileFilter: filefilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	next();
});

//Routes
app.use(userRoutes);
app.use(adminRoutes);
app.use(bookRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`server is running`);
});
