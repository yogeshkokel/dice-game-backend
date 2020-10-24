const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __base + '/public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, +new Date() + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('file')

module.exports = upload;