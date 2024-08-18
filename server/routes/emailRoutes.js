const express = require("express");
const emailController = require("../controllers/emailController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();
router.post("/setupSmtp", emailController.setupSMTP);
router.post("/sendEmail", emailController.sendEmail);
router.post("/addEmail", authenticate, emailController.addMail);
router.get("/getEmails", authenticate, emailController.listEmails);
router.delete("/deleteEmail/:id", authenticate, emailController.deleteMail);
router.put('/updateEmail/:id', authenticate, emailController.updateEmail);


module.exports = router;
