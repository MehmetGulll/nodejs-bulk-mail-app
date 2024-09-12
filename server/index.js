const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require('./routes/authRoutes');
const emailRoutes = require("./routes/emailRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const fileRoutes = require('./routes/fileRoutes');
require('dotenv').config();
(async () => {
  const chalk = (await import('chalk')).default;

  const app = express();
  const port = 8000;

  app.use(bodyParser.json());
  app.use(cors());

  app.use(authRoutes);
  app.use(categoryRoutes);
  app.use(emailRoutes);
  app.use(fileRoutes);


  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection.on("connected", async () => {
    console.log(chalk.green("MongoDB bağlantısı başarılı ✅"));
  });

  mongoose.connection.on("error", (err) => {
    console.log(chalk.red("MongoDB bağlantı hatası:", err, '❌'));
  });


  app.listen(port, () => {
    console.log(chalk.blue(`Server running at http://localhost:${port} 🚀`));
  });
})();