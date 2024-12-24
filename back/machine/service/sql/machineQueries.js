exports.getAllMachinesQuery = `
  SELECT 
      m.*, 
      -- Total de pontos vinculados à máquina
      (SELECT COUNT(*)
      FROM points.point p
      WHERE p.machine_id = m.id) AS totalPoints,
      -- Total de sensores vinculados aos pontos dessa máquina
      (SELECT COUNT(*)
      FROM sensors.sensor s
      WHERE s.point_id IN (
          SELECT p.id
          FROM points.point p
          WHERE p.machine_id = m.id
      )) AS totalSensors
  FROM 
      machines.machine m;
`;

exports.getMachineByIdQuery = `
  SELECT 
    m.id AS id, 
    m.name AS name, 
    m.type AS type, 
    COALESCE(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'id', p.id, 
          'name', p.name, 
          'totalSensors', COALESCE((
              SELECT COUNT(*) 
              FROM sensors.sensor s 
              WHERE s.point_id = p.id
          ), 0)
        )
      ) FILTER (WHERE p.id IS NOT NULL), 
      '{}'::json[]
    ) AS points 
  FROM machines.machine m 
  LEFT JOIN points.point p ON m.id = p.machine_id 
  WHERE m.id = $1 
  GROUP BY m.id;
`;

exports.deleteMachineByIdQuery = 'DELETE FROM machines.machine WHERE id = $1';