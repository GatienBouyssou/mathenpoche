let crypto = require('crypto');
const salt = "ceci%Est>UneSite**P0urMa1henPoche";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

module.exports.hash = function (password) {
    return crypto.createHash('sha256').update(password + salt).digest("hex");
};

module.exports.encrypt = function (text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('hex');
};
