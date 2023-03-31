const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB(url) {
  return await mongoose.connect(url);
}

module.exports = {
  connectToMongoDB,
};
