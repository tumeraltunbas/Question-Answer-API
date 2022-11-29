const multer = require("multer");
const path = require("path");
const CustomError = require("../error/CustomError");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb)=>
    {
        cb(null, path.join(path.dirname(require.main.filename), "/public/uploads"));
    },
    filename: function(req, file, cb)
    {
        const extension = file.mimetype.split("/")[1];
        const randomText = crypto.randomBytes(10).toString("hex");
        const fileName = "image_" + String(req.user.id) + "__" + randomText + "." + extension;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) =>
{
    const allowedMimetypes = ['image/jpg', "image/jpeg", "image/png"];
    if(!allowedMimetypes.includes(file.mimetype))
    {
        return cb(new CustomError(400, "Unsupported file type. Just use jpg, jpeg or png types"), false);
    }
    cb(null, true);   
}

const upload = multer({storage:storage, fileFilter:fileFilter});

module.exports = upload;