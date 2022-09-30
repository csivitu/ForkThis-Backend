import path from 'path'
import multer from 'multer';

const multerDiskStorage = modelName => multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, `./public/${modelName}s/${file.fieldname}s`)
    },
    filename: function(req, file, callback) {
        const name=`${req.body.username}-${Date.now()}`+ path.extname(file.originalname);
        req.body[`${file.fieldname}`] = name
        callback(null, name);
    }
})

export default multerDiskStorage;