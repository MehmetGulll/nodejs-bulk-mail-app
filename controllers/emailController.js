const nodemailer = require('nodemailer');
const Email = require('../models/Email');
const path = require('path');

// SMTP ayarları
const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'destekbilcom@gmail.com',
    pass: 'fodb adtl rucy zhoi' // Uygulama şifresi
  }
});

const sendEmail = async () => {
  try {
    const emails = await Email.find({});
    console.log('Fetched emails:', emails);  // E-postaları loglayarak kontrol edelim
    if (!emails.length) {
      console.log('No emails found in the database.');
      return;
    }

    for (const emailDoc of emails) {
      const mailOptions = {
        from: 'destekbilcom@gmail.com',
        to: emailDoc.email,
        subject: 'Toplu Mail Başlığı',
        html: `
        <html>
          <body>
            <p style="text-align: center;">Bu, toplu olarak gönderilen bir e-postadır.</p>
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
        attachments: [{
          filename: 'resim1.png',
          path: path.join(__dirname, '../resim1.png'),
          cid: 'image1' // same cid value as in the html img src
        }]
      };

      try {
        await smtpTransport.sendMail(mailOptions);
        console.log(`Mail sent to ${emailDoc.email}`);
      } catch (error) {
        console.log(`Failed to send email to ${emailDoc.email}: `, error);
      }
    }

    console.log('E-postalar başarıyla gönderildi');
  } catch (error) {
    console.error('E-posta gönderimi sırasında hata oluştu', error);
  }
};

module.exports = { sendEmail };
