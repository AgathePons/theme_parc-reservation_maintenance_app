const validator = {
    validateBody: (schema, callback) => (request, response, next) => {
        const {error} = schema.validate(request.body);
        if (error) {
            callback(response, error);
        } else {
            next();
        }
    },
    validateQuery: schema => (request, response, next) => {
        const {error} = schema.validate(request.query);
        if (error) {
            callback(response, error);
        } else {
            next();
        }
    },
    validateParams: schema => (request, response, next) => {
        const {error} = schema.validate(request.params);
        if (error) {
            callback(response, error);
        } else {
            next();
        }
    } 
};

module.exports = validator