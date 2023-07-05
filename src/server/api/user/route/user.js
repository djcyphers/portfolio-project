const express = require("express");
const router = express.Router();
const cleanBody = require("../../middleware/cleanbody");
const { validateToken } = require("../../middleware/validateToken");
const userController = require("../controller/userController");
/* 

Route localhost/user/route
All routes are prepended with "user" see server.js file for details

*/
router.get("/profile", validateToken, userController.getUserDetails);
// Disable registration for now
router.post("/register", cleanBody, userController.register);
router.post("/activate", cleanBody, userController.activate);
router.post("/login", cleanBody, userController.login);
router.patch("/forgot", cleanBody, userController.forgotPassword); // patch?
router.patch("/reset", cleanBody, userController.resetPassword); // patch?
router.get("/referred", validateToken, userController.referredAccounts);
router.get("/logout", validateToken, userController.logout);
// Send contact message
router.post("/contact", cleanBody, userController.contactForm);

module.exports = router;
