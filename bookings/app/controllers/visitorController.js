const { Visitor } = require("../models");

const visitorController = {
    init: (_, response) => {
        response.json(response.locals.visitor);
    }
};

module.exports = visitorController;