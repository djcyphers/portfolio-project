const express = require("express");
const router = express.Router();
const cleanBody = require("../../middleware/cleanbody");
const { validateToken } = require("../../middleware/validateToken");
const userController = require("../controller/userController");

router.get("/profile", validateToken, userController.getUserDetails);
router.post("/register", cleanBody, userController.register);
router.post("/activate", cleanBody, userController.activate);
router.post("/login", cleanBody, userController.login);
router.patch("/forgot", cleanBody, userController.forgotPassword); // patch?
router.patch("/reset", cleanBody, userController.resetPassword); // patch?
router.get("/referred", validateToken, userController.referredAccounts);
router.get("/logout", validateToken, userController.logout);

module.exports = router;
