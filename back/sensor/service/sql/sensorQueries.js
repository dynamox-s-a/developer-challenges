exports.deletePointByIdQuery = 'DELETE FROM sensors.sensor WHERE id = $1';

exports.postAddSensor = `INSERT INTO sensors.sensor(type, point_id) VALUES ($1, $2) RETURNING id, type, point_id;`;