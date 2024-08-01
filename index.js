const mongoose = require('mongoose');
const { sendEmail } = require('./controllers/emailController');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/BulkMailDB')

mongoose.connection.on('connected', async () => {
  console.log('MongoDB bağlantısı başarılı');
  await sendEmail();
  mongoose.connection.close(); // İşlem tamamlandıktan sonra bağlantıyı kapatın
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB bağlantı hatası:', err);
});
