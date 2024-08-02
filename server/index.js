const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); 
const { exec } = require('child_process');
const { sendEmail } = require('./controllers/emailController');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'build', 'index.html'));
});
app.use(cors());
mongoose.connect('mongodb://127.0.0.1:27017/BulkMailDB')

mongoose.connection.on('connected', async () => {
  console.log('MongoDB bağlantısı başarılı');

});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB bağlantı hatası:', err);
});

app.use(emailRoutes);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
  exec(`${start} http://localhost:${port}`);
});

