const router = require("express").Router();
const {register, login,logout,forgotPassword,resetPassword,updateUser,uploadProfileImage} = require("../controllers/user");
const {isUserExists, isUserLoggedIn} = require("../middlewares/authorization/authorization");
const upload = require("../helpers/libraries/uploadImage");

router.post("/register", register);
router.post("/login", isUserExists, login);
router.get("/logout", isUserLoggedIn, logout);
router.post("/forgotpassword",isUserExists, forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/update", isUserLoggedIn, updateUser);
router.post("/upload", [isUserLoggedIn, upload.single("profile_image")], uploadProfileImage);

module.exports = router;