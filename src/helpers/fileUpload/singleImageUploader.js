const multer = require('./multer');
const {
    uploader: { upload: uploadImage },
} = require('./cloudinary');

const imageUpload = (folderName) => async (req, res, next) => {
    if (req.file) {
        const { secure_url, public_id } = await uploadImage(req.file.path, {
            folder: folderName,
        });
        req.image = {
            url: secure_url,
            publicId: public_id,
        };
    }

    next();
};
module.exports = (fieldName, folderName) => [multer.single(fieldName), imageUpload(folderName)];
