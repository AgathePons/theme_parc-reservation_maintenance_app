const db = require('../database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
require('dayjs/locale/fr');

dayjs.extend(utc)
dayjs.locale('fr');

class Incident {
    constructor(data={}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static toFrenchDate(date) {
        return dayjs(date).format('dddd D MMMM YYYY, HH:mm');
    }

    static async findAll() {
        return (await db.query('SELECT * FROM incident.detailed_incident'))
            .rows.map(row => new Incident({
                ...row, 
                last_update: this.toFrenchDate(row.comments[0]?.date || row.open_date),
                open_date: this.toFrenchDate(row.open_date)
            }));
    }

    static async findOne(id) {
        const row = (await db.query('SELECT * FROM incident.detailed_incident WHERE id=$1', [id])).rows[0];
        return new Incident({
            ...row, 
            open_date: this.toFrenchDate(row.open_date),
            comments: row.comments.map(comment => ({
                ...comment, 
                date: this.toFrenchDate(comment.date)
            }))
        });
    }

    static async update(data) {
        if (!data.close)
            data.close = false;
        if (data.comment) {
            await db.query('SELECT incident.update_incident_with_comment($1)', [data]);
        } else {
            await db.query('SELECT incident.update_incident($1)', [data]);
        }
    }

    static async eventsList() {
        return (await db.query('SELECT * FROM incident.incident_events')).rows;
    }

    static async create(data) {
        if (data.comment) {
            return (await db.query('SELECT incident.new_incident_with_comment($1) AS id', [data])).rows[0].id;
        } else {
            return (await db.query('SELECT incident.new_incident($1) AS id', [data])).rows[0].id;
        }
    }

    static async modifyEvent(data) {
        await db.query('SELECT incident.modify_event($1)', [data]);
    }
}

module.exports = Incident;