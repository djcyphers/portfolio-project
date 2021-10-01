const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.get("/profile", userController.getUserDetails);

module.exports = router;
