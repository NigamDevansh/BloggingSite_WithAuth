const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/userSchema");


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











// ------------------------------------------------------------------------------------------

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/signin", (req, res) => {
    return res.render("signin");
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchedPasswordandGenerateToken(email, password);

        // console.log("Token", token);
        return res.cookie("token", token).redirect("/");

    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password !"
        });
    }
});

router.post("/signup", upload.single('profileImageUrl'), async (req, res) => {
    const { fullName, email, password } = req.body; 
    if (req.file === undefined) {
        await User.create({
        fullName,
        email,  
        password,
    });
    }
    else {
        await User.create({
        fullName,
        email,  
        password,
        profileImageUrl: `/uploads/${req.file.filename}`,
    });
    }
    return res.render("signin");
});

router.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/");
});


module.exports = router;