const multer = require("multer");

const FILE_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE[file.mimetype];
    let uploadError = new Error("Invalid Image Type. only support (jpg, jpeg, png)");
    
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");

    cb(null, Date.now() + fileName.toLocaleLowerCase());
  },
});

const upload = multer({ storage: storage });

module.exports = upload