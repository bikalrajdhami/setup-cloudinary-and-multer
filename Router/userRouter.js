const express= require("express");
const { getUser, createUser, getByUser, deleteuser, updateuser, userlogin} = require("../Controller/userController");
const verifyUser = require("../middleware/auth");
const route =express.Router();

route.get("/", getUser);
route.post("/login", userlogin);
route.post("/", createUser);
route.get("/:id", getByUser );
route.delete("/:id",verifyUser,deleteuser)
route.patch("/:id",verifyUser, updateuser)

module.exports=route
