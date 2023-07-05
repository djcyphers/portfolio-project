const express = require("express");
const router = express.Router();
const aiController = require("../controller/aiController");
// const cleanBody = require("../../middleware/cleanbody");
/* 

Route localhost/openai/route 
All routes are prepended with openai *Reminder lol*

*/

// Post OpenAI chat message
router.post("/chat", aiController.getChatResult);

module.exports = router;