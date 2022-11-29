const router = require("express").Router();
const { isUserLoggedIn,getAdminAccess} = require("../middlewares/authorization/authorization");
const {blockUser,deleteUser,getAllUsers,getUserById} = require("../controllers/admin");
const User = require("../models/User");
const adminQueryMiddleware = require("../middlewares/query/adminQueryMiddleware");

router.get("/users", [isUserLoggedIn, getAdminAccess, adminQueryMiddleware(User)], getAllUsers);
router.get("/users/:user_id", [isUserLoggedIn, getAdminAccess], getUserById);
router.get("/:user_id",[isUserLoggedIn,getAdminAccess] , blockUser);
router.delete("/:user_id",[isUserLoggedIn,getAdminAccess] , deleteUser);


module.exports = router;
