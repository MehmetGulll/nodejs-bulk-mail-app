const nodemailer = require("nodemailer");
const path = require("path");
const Email = require("../models/Email");
const asyncHandler = require("../middlewares/asyncHandler");

let smtpTransport;
let defaultFromEmail;
exports.setupSMTP = asyncHandler(async (req, res) => {
  const { host, port, user, password, fromEmail } = req.body;

  smtpTransport = nodemailer.createTransport({
    host: host,
    port: port,
    secure: true,
    auth: {
      user: user,
      pass: password,
    },
  });

  defaultFromEmail = fromEmail;

  smtpTransport.verify(function (error, success) {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: "SMTP setup failed", details: error });
    } else {
      console.log("SMTP settings are configured correctly.");
      return res.send({ message: "SMTP setup successful" });
    }
  });
});

exports.sendEmail = asyncHandler(async (req, res) => {
  const selectedCategory = req.body.name;
  const userMessage = req.body.message; 

  if (!selectedCategory) {
    return res.status(400).send({ error: "Category name is required." });
  }

  const emails = await Email.find({ name: selectedCategory });

  if (!emails.length) {
    return res
      .status(404)
      .send({ error: `No emails found for category ${selectedCategory}.` });
  }

  const user = req.user;
  if (!user || !user.files || !user.files.length) {
    return res.status(404).send({ error: "Kullanıcı dosyası bulunamadı." });
  }

  const lastFile = user.files[user.files.length - 1];

  const failedEmails = [];

  for (const emailDoc of emails) {
    const mailOptions = {
      from: defaultFromEmail,
      to: emailDoc.email,
      subject: "Toplu Mail",
      html: `
        <html>
          <body>
            <table role="presentation" style="width: 100%; background-color: #333;">
              <tr>
                <td style="text-align: center;">
                  <img src="cid:userImage" alt="User uploaded image" style="display: block; margin: 0 auto; max-width: 100%; height: auto;">
                </td>
              </tr>

              ${
                userMessage
                  ? `
              <tr>
                <td style="text-align: center; padding: 20px;">
                  <p style="color: #fff; text-align: center; border-top: 1px solid #fff; padding-top: 10px;">
                    ${userMessage}
                  </p>
                </td>
              </tr>
              `
                  : ""
              }
              
            </table>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: lastFile.filename,
          content: lastFile.data.split(",")[1],
          encoding: "base64",
          cid: "userImage",
        },
      ],
    };

    try {
      await smtpTransport.sendMail(mailOptions);
      console.log(`Mail sent to ${emailDoc.email}`);
    } catch (error) {
      console.log(`Failed to send email to ${emailDoc.email}: `, error);
      failedEmails.push(emailDoc.email);
    }
  }

  if (failedEmails.length > 0) {
    console.log(
      `Failed to send emails to the following addresses: ${failedEmails.join(
        ", "
      )}`
    );
    return res.status(207).send({
      message: "Some emails failed to send.",
      failedEmails: failedEmails,
    });
  }

  console.log("E-mails successfully sent");
  res.send("E-mails successfully sent");
});

exports.listEmails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const emails = await Email.find({ userId }, "email name");
  res.status(200).json(emails);
});

exports.addMail = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { name, email } = req.body;
  const userId = req.user._id;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const newEmail = new Email({ name, email, userId });
  await newEmail.save();
  res.status(201).json(newEmail);
});

exports.deleteMail = asyncHandler(async (req, res) => {
  const emailId = req.params.id;
  const userId = req.user._id;

  const email = await Email.findById(emailId);
  if (!email) {
    return res.status(404).json({ error: "Email not found" });
  }

  if (email.userId.toString() !== userId.toString()) {
    return res.status(403).json({ error: "Unauthorized to delete this email" });
  }

  const deleteEmail = await Email.findByIdAndDelete(emailId);
  if (!deleteEmail) {
    return res.status(404).json({ error: "Failed to delete the email" });
  }

  res.status(200).json({ message: "Email deleted successfully!" });
});

exports.updateEmail = asyncHandler(async (req, res) => {
  const emailId = req.params.id;
  const userId = req.user._id;
  const { email } = req.body;

  const emailToUpdate = await Email.findOne({ _id: emailId, userId: userId });
  if (!emailToUpdate) {
    return res.status(404).json({ error: "Email not found or access denied" });
  }

  const updatedEmail = await Email.findByIdAndUpdate(
    emailId,
    { email },
    { new: true }
  );
  if (!updatedEmail) {
    return res.status(404).json({ error: "Failed to update email" });
  }

  res.status(200).json(updatedEmail);
});
