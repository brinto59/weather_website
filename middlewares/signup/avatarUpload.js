const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const uploadPath = path.join(__dirname, "../../public/uploads/avatars/");
const allowed_file_types = ["image/jpeg", "image/jpg", "image/png"];
const maxFileSize = 1000000; // 1 MB

const avatarUpload = function (req, res, next) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-")
          .trim() +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: function (req, file, cb) {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError("only .jpg, .jpeg, or .png format allowed"));
      }
    },
  });

  upload.any()(req, res, function (err) {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = avatarUpload;
