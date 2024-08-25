const multer = require('multer');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');

const uploadDir = path.join(__dirname, '../'); 
const uploadFileName = 'resim1'; 


const checkAndDeleteExistingFile = (filename) => {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`${filename} dosyası silindi.`);
    }
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const newFilename = uploadFileName + path.extname(file.originalname); 
        checkAndDeleteExistingFile(newFilename); 
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage }).single('image');

exports.uploadFile = asyncHandler((req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(500).send("Multer hatası: " + err.message);
        }
        
        const filePath = path.join(uploadDir, uploadFileName + path.extname(req.file.originalname));

        const user = req.user;
        if (!user) {
            return res.status(404).send("Kullanıcı bulunamadı.");
        }

        user.files.push({
            filename: req.file.originalname,
            path: filePath
        });
        await user.save();

        res.send('Dosya başarıyla yüklendi ve kullanıcıya eklendi.');
    });
});
