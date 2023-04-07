require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const { connectToMongoDB } = require("./connect");
const {
	checkForAuthenticationCookie,
} = require("./middleware/authenticationCheck");
const Blog = require("./models/blogSchema");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const PORT = process.env.PORT || 8080;

connectToMongoDB().then(() => console.log("Mongodb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//tells express how to parse json data
// app.use(express.json());
//tells express how to parse html data coming from form
app.use(express.urlencoded({ extended: false }));
//for parsing the cookie
app.use(cookieParser());
//this is basic middleware whichc wil check all the incoming routes
app.use(checkForAuthenticationCookie("token"));
//for making the public folder read as static rather than as a route
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
	const allBlogs = await Blog.find({}).sort("createdAt");
	res.render("home", {
		user: req.user,
		blogs: allBlogs,
	});
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () =>
	console.log(`Server Started at PORT:${PORT}  http://localhost:${PORT}/`),
);
