const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const { uploadOne } = require("./api");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync("public")) {
            fs.mkdirSync("public");
        }
        if (!fs.existsSync("public/uploads")) {
            fs.mkdirSync("public/uploads");
        }
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
        return cb(new Error("This file format is not supported"));
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 }
});

const cpUpload = upload.fields([{ name: "file", maxCount: 1 }]);

const { verifyUser } = require("../users/service");

router.post("/create", verifyUser, cpUpload, uploadOne);

module.exports = router;
