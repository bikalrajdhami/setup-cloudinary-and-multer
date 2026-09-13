const express= require("express");
const { getUser, createUser, getByUser, deleteuser, updateuser, userlogin, verifyToken, forgotPassword} = require("../Controller/userController");
const verifyUser = require("../middleware/auth");
const route =express.Router();

route.post("/", createUser);
route.get("/", getUser);
route.post("/login", userlogin);
route.get("/verify-email/:verificationToken", verifyToken);
route.post("/forgotPassword", forgotPassword);
route.get("/:id", getByUser );
route.delete("/:id",verifyUser,deleteuser)
route.patch("/:id",verifyUser, updateuser)

module.exports=route
