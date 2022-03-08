const sanitizer = require('sanitizer');


const sanitize = obj => {
    for (const prop in obj) {
        obj[prop] = sanitizer.escape(obj[prop]);
    }
}

const cleaner = (request, response, next) => {
    sanitize(request.params);
    sanitize(request.query);
    if (request.body) {
        sanitize(request.body);
    }
    next();
}

module.exports = cleaner;