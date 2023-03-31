const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    body: {
        type: String,
        require: true,
    },
    coverImgUrl: {
        type: String,
        default:false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        // This will automatically refer to the user table
        ref: "user"
    }
    },
    { timestamps: true }
);

const Blog = model("blog", blogSchema);

module.exports = Blog;