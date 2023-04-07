require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB() {
	return await mongoose.connect(process.env.MONGODB_URL);
}

module.exports = {
	connectToMongoDB,
};
