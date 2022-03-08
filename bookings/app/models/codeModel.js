const db = require('../database');

class CoreModel {
    constructor(data={}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async getArray(...args) {
        return (await db.query(...args)).rows;
    }

    static async getRow(...args) {
        return (await this.getArray(...args))[0];
    }
}

module.exports = CoreModel;