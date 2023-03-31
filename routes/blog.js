const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");
const router = Router();


const storage = multer.diskStorage({
    //This tells where to store the file on disk
    destination: function (req, file, cb) {
        //har user ka apna apna folder hai
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage });



//--------------------------------------------------------------------------------------------------------/

router.get("/add-new", (req, res) => {
    if (req.user === undefined) {
        return res.render("signup");
    }
    return res.render("newblog", {
        user: req.user,
    });
});

router.post("/", upload.single('coverImg'), async (req, res) => {
    // As there is file uploading hence it is handeled separately by req.file
    const { title, body } = req.body;
    // console.log(req.file)
    const blog= await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImgUrl: `/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    return res.render("blog", {
        user: req.user,
        blog: blog,
        comments:comments,
    })
})

router.post("/comments/:blogId", async (req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})


module.exports = router;