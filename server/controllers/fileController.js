const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

exports.uploadFile = (req, res) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).send("Multer hatası: " + err.message);
        } else if (err) {
            return res.status(500).send("Dosya yüklenirken bilinmeyen hata: " + err.message);
        }
        res.send('Dosya başarıyla yüklendi');
    });
};
