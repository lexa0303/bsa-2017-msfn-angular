const fs = require('fs'),
    userService = require('./userService'),
    ApiError = require('./apiErrorService');

function FileService() { }

FileService.prototype.save = save;

function save(req, res, callback) {
    if (req.body.data) {

        if (req.body.fileType = 'img') {
            const type = req.body.data.split('data:image/')[1].split(';')[0];
            const file = req.body.data.replace(/^data:image\/\w+;base64,/, "");
            const buf = new Buffer(file, 'base64');
            const folderName = req.body.folder;
            const fileName = req.body.fileName;
            const folderPath = __dirname + '/../../resources/' + folderName + '/';
            const filepath = folderPath + fileName + '.' + type;

            // max size is 3mb
            if (buf.byteLength > 3e+6) {
                // return callback(new ApiError('file is too big, max size is 3mb'));
                return callback(null, { 'err': 'file is too big, max size is 3mb' });
            }

            checkAndCreateFolder(folderPath, () => {
                checkAndRemoveDublicatFile(folderPath, fileName, () => {

                    let writeStream = fs.createWriteStream(filepath);
                    writeStream.write(buf);

                    // error processing
                    req
                        .on('close', () => {
                            writeStream.destroy();
                            fs.unlink(filepath, err => { });
                            return callback(new ApiError('error'));
                        })
                        .pipe(writeStream);
                    writeStream
                        .on('error', err => {
                            console.error(err);
                            fs.unlink(filepath, err => { });
                            return callback(new ApiError('conection close'));
                        })
                        .on('close', () => {
                            // add/update userPhotoPath in database
                            savePathInDb(folderName, fileName, type)
                            return callback(null, 'done')
                        })
                })
            });
        } else {
            return callback(new ApiError('wrong format'));
        }
    } else {
        return callback(new ApiError('empty file'));
    }
}

function checkAndCreateFolder(folderPath, callback) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
    }
    callback();
}

function checkAndRemoveDublicatFile(folderPath, userId, callback) {
    fs.readdir(folderPath, (err, files) => {
        files.forEach(el => {
            if (el.split('.')[0] === userId) {
                fs.unlink(folderPath + el, (err, res) => {
                    console.log(err, res);
                });
            }
        })
        callback();
    })
}

function savePathInDb(folderName, fileName, type) {
    if (folderName === 'usersImg') {
        const userPhotoPath = '/resources/' + folderName + '/' + fileName + '.' + type;
        userService.updateItem(fileName, { userPhoto: userPhotoPath })
    }
}

module.exports = new FileService();
