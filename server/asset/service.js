const path = require('path');
const fs = require('fs');

const removeImage = (imagePath) => {
    const filePath = path.join(__dirname, "../", imagePath);
    fs.unlink(filePath, (err) => {
        err && console.log(err);
    });
}

module.exports = {
    removeImage
}