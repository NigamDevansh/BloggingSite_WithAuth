const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto")
const { createTokenForUser } = require("../services/authJWT");


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    //ye neeche calculate hoga aur fir uppar aaega iss schema pr to save it to mongoDB
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/defaultAvatar.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default:"USER"
    },
    
    },
    { timestamps: true }
);

// this will be called first whenever the schema beaing created
userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
})

userSchema.static("matchedPasswordandGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not FOUND ! ");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    if (hashedPassword !== userProvidedHash) throw new Error("Password Incorrect XD ! ");
    const token = createTokenForUser(user);
    return token;
})



const User = model('user', userSchema);
module.exports = User;