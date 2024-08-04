const nodemailer = require("nodemailer");
const path = require("path");
const Email = require("../models/Email");

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "destekbilcom@gmail.com",
    pass: "fodb adtl rucy zhoi",
  },
});

const sendEmail = async (req, res) => {
  const selectedCategory = req.body.name;

  if (!selectedCategory) {
    return res.status(400).send({ error: "Category name is required." });
  }

  try {
    const emails = await Email.find({ name: selectedCategory });
    console.log("Fetched emails:", emails);

    if (!emails.length) {
      console.log(`No emails found for category ${selectedCategory}.`);
      return res
        .status(404)
        .send({ error: `No emails found for category ${selectedCategory}.` });
    }

    for (const emailDoc of emails) {
      const mailOptions = {
        from: "destekbilcom@gmail.com",
        to: emailDoc.email,
        subject: "Toplu Mail Başlığı",
        html: `
          <html>
            <body>
              <div style="text-align: center;">
                <img src="cid:image1" style="display: block; margin: 0 auto;">
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://www.example1.com" style="text-decoration: none; display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 5px; background-color: #007BFF; color: white;">Button 1</a>
                <a href="https://www.example2.com" style="text-decoration: none; display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 5px; background-color: #28A745; color: white;">Button 2</a>
                <a href="https://www.example3.com" style="text-decoration: none; display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 5px; background-color: #DC3545; color: white;">Button 3</a>
              </div>
              <div style="text-align: center; margin-top: 20px; background-color: #333; color: white; padding: 20px;">
                <p>Copyright © 2024 Bilcom Bilgisayar bütün hakları saklıdır.</p>
                <p>Bu e-postaları alma şeklinizi değiştirmek ister misiniz?</p>
                <p>Tercihlerinizi güncelleyebilir veya <a href="https://unsubscribe.example.com" style="color: orange;">bu abone listesinden çıkabilirsiniz</a>.</p>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: "resim1.png",
            path: path.join(__dirname, "../resim1.png"),
            cid: "image1",
          },
        ],
      };

      try {
        await smtpTransport.sendMail(mailOptions);
        console.log(`Mail sent to ${emailDoc.email}`);
      } catch (error) {
        console.log(`Failed to send email to ${emailDoc.email}: `, error);
        return res
          .status(500)
          .send({
            error: `Failed to send email to ${emailDoc.email}: ${error.message}`,
          });
      }
    }

    console.log("E-mails successfully sent");
    res.send("E-mails successfully sent");
  } catch (error) {
    console.error("Error during email sending", error);
    res.status(500).send({ error: "Error during email sending" });
  }
};

const addMail = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const newEmail = new Email({ name, email });
    await newEmail.save();
    res.status(201).json(newEmail);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "An error occurred while adding email." });
  }
};

module.exports = { sendEmail, addMail };
