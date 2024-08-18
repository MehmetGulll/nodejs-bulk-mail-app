const nodemailer = require("nodemailer");
const path = require("path");
const Email = require("../models/Email");
const asyncHandler = require('../middlewares/asyncHandler')

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
      pass: password
    }
  });

  defaultFromEmail = fromEmail;  


  smtpTransport.verify(function (error, success) {
    if (error) {
      console.error(error);
      return res.status(500).send({ error: "SMTP setup failed", details: error });
    } else {
      console.log('SMTP settings are configured correctly.');
      return res.send({ message: "SMTP setup successful" });
    }
  });
});

exports.sendEmail = asyncHandler(async (req, res) => {
  const selectedCategory = req.body.name;
  console.log('Received name:', req.body.name);

  if (!selectedCategory) {
    return res.status(400).send({ error: "Category name is required." });
  }

  const emails = await Email.find({ name: selectedCategory });

  if (!emails.length) {
    console.log(`No emails found for category ${selectedCategory}.`);
    return res.status(404).send({ error: `No emails found for category ${selectedCategory}.` });
  }

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
                  <img src="cid:image1" style="display: block; margin: 0 auto; max-width: 100%; height: auto;">
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <table style="margin: 0 auto; width: 80%; border-spacing: 10px;">
                    <tr>
                      <td style="background-color: #333; text-align: center; width: 33%;">
                        <a href="https://www.bilcom.com.tr/" style="text-decoration: none; padding: 10px 20px; border-radius: 5px; background-color: #333; color: white;">www.bilcom.com.tr</a>
                      </td>
                      <td style="background-color: #333; text-align: center; width: 33%;">
                        <a href="https://www.instagram.com/bilcomizmir/" style="text-decoration: none; padding: 10px 20px; border-radius: 5px; background-color: #333; color: white;">bilcomizmir</a>
                      </td>
                      <td style="background-color: #333; text-align: center; width: 33%;">
                        <a href="#" style="text-decoration: none; padding: 10px 20px; border-radius: 5px; background-color: #333; color: white;">+90 (0232) 446 55 76</a>
                      </td>
                    </tr>
                  </table>
               </td>
              </tr>
            </table>
            <table role="presentation" style="width: 100%; background-color: #333; margin-top: 20px;">
              <tr>
                <td style="text-align: center; padding: 20px;">
                  <div style="color: white;">
                    <p>Copyright © 2024 Bilcom Bilgisayar bütün hakları saklıdır.</p>
                    <p>Bu e-postaları alma şeklinizi değiştirmek ister misiniz?</p>
                    <p>Tercihlerinizi güncelleyebilir veya <a href="https://bilcom.com.tr/unsubscribe.html" style="color: orange;">bu abone listesinden çıkabilirsiniz</a>.</p>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: "resim1.png",
          path: path.join(__dirname, "../resim1.png"),
          cid: "image1"
        }
      ]
    };

    try {
      await smtpTransport.sendMail(mailOptions);
      console.log(`Mail sent to ${emailDoc.email}`);
    } catch (error) {
      console.log(`Failed to send email to ${emailDoc.email}: `, error);
      return res.status(500).send({
        error: `Failed to send email to ${emailDoc.email}: ${error.message}`
      });
    }
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

exports.updateEmail = asyncHandler(async(req, res) => {
  const emailId = req.params.id;
  const userId = req.user._id; 
  const { email } = req.body;

  const emailToUpdate = await Email.findOne({ _id: emailId, userId: userId }); 
  if (!emailToUpdate) {
    return res.status(404).json({ error: "Email not found or access denied" });
  }

  const updatedEmail = await Email.findByIdAndUpdate(emailId, { email }, { new: true });
  if (!updatedEmail) {
    return res.status(404).json({ error: "Failed to update email" });
  }

  res.status(200).json(updatedEmail);
});

