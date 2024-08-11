const nodemailer = require("nodemailer");
const path = require("path");
const Email = require("../models/Email");
const asyncHandler = require('../middlewares/asyncHandler')

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "destekbilcom@gmail.com",
    pass: "fodb adtl rucy zhoi",
  },
});

exports.sendEmail = asyncHandler(async (req, res) => {
  const selectedCategory = req.body.name;

  if (!selectedCategory) {
    return res.status(400).send({ error: "Category name is required." });
  }

  const emails = await Email.find({ name: selectedCategory });

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
      subject: "Bilcom Bilgisayar",
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
                    <p>Tercihlerinizi güncelleyebilir veya <a href="https://bilcom.com.tr/unsucscribe.html" style="color: orange;">bu abone listesinden çıkabilirsiniz</a>.</p>
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
          cid: "image1",
        },
      ],
    };

    try {
      await smtpTransport.sendMail(mailOptions);
      console.log(`Mail sent to ${emailDoc.email}`);
    } catch (error) {
      console.log(`Failed to send email to ${emailDoc.email}: `, error);
      return res.status(500).send({
        error: `Failed to send email to ${emailDoc.email}: ${error.message}`,
      });
    }
  }

  console.log("E-mails successfully sent");
  res.send("E-mails successfully sent");
});

exports.listEmails = asyncHandler(async (req, res) => {
  const emails = await Email.find({}, "email name");
  res.status(200).json(emails);
});

exports.addMail = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }
  const newEmail = new Email({ name, email });
  await newEmail.save();
  res.status(201).json(newEmail);
});


exports.deleteMail = asyncHandler(async(req,res)=>{
  const emailId = req.params.id;
  const deleteEmail = await Email.findByIdAndDelete(emailId);
  if(!deleteEmail){
    return res.status(404).json({error:"Email not found"});
  }
  res.status(200).json({message:"Email deleted succesfuly!"});
})

exports.updateEmail = asyncHandler(async(req,res)=>{
  const emailId = req.params.id;
  const {email} = req.body;
  const updatedEmail = await Email.findByIdAndUpdate(emailId, {email},{new:true});
  if(!updatedEmail){
    return res.status(404).json({error:"Email not found"});
  }
  res.status(200).json(updatedEmail);
})

