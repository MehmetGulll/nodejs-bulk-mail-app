const multer = require('multer');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

exports.uploadFile = asyncHandler(async (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(500).send("Multer hatası: " + err.message);
        }

        const base64 = Buffer.from(req.file.buffer).toString('base64');
        const base64Image = `data:${req.file.mimetype};base64,${base64}`;

        const user = req.user;
        if (!user) {
            return res.status(404).send("Kullanıcı bulunamadı.");
        }

        user.files.push({
            filename: req.file.originalname,
            data: base64Image, 
            uploaded: new Date() 
        });
        await user.save();

        res.send('Dosya Base64 formatında başarıyla yüklendi ve kullanıcıya eklendi.');
    });
});
