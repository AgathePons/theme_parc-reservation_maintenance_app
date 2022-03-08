const client = require('../config/db');

module.exports = {
  async findByTicket(ticket) {
    const result = await client.query('SELECT * FROM visitor WHERE ticket = $1', [ticket]);

    if (result.rowCount === 0) {
      return undefined;
    }

    return result.rows[0];
  },

  async findFuturBookings(id) {
    const result = await client.query(
      `SELECT * FROM attraction_has_visitor WHERE visitor_id = $1 AND reservation_hour > NOW();`,
      [id]
    );

    if (result.rowCount === 0) {
      return undefined;
    }

    return result.rows;
  },

  async insert(reservation) {
    const savedReservation = await client.query(
      `
            INSERT INTO attraction_has_visitor
            (number_places, reservation_hour, 
              attraction_id, visitor_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `,
      [reservation.number_places, reservation.reservation_hour, reservation.attraction_id, reservation.visitor_id]
    );

    return savedReservation.rows[0];
  },

  async isUnique(inputData, reservationId) {
    const fields = [];
    const values = [];
    // On récupère la liste des infos envoyés
    Object.entries(inputData).forEach(([key, value], index) => {
      // On ne garde que les infos qui sont censées être unique
      if (['number_places', 'reservation_hour', 'attraction_id', 'visitor_id'].includes(key)) {
        // On génère le filtre avec ces infos
        fields.push(`"${key}" = $${index + 1}`);
        values.push(value);
      }
    });

    const preparedQuery = {
      text: `SELECT * FROM attraction_has_category WHERE (${fields.join(' OR ')})`,
      values,
    };

    // Si l'id est fourni on exclu l'enregistrement qui lui correspond
    if (reservationId) {
      preparedQuery.text += ` AND id <> $${values.length + 1}`;
      preparedQuery.values.push(reservationId);
    }
    const result = await client.query(preparedQuery);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  },
};
