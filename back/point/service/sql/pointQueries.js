exports.getAllPointsQuery = `
  SELECT 
      p.id AS id,
      p.id AS "point_id",
      p.name AS "point_name",
      m.name AS "machine_name",
      m.type AS "machine_type",
      STRING_AGG(DISTINCT s.type, ', ') AS "sensors"
  FROM 
      points.point p
  LEFT JOIN 
      machines.machine m ON p.machine_id = m.id
  LEFT JOIN 
      sensors.sensor s ON s.point_id = p.id
  GROUP BY 
      p.id, p.name, m.name, m.type
  ORDER BY 
      p.id;
`;

exports.getPointByIdQuery = `
  SELECT 
    p.machine_id,
    m.type AS machine_type,
    p.id AS id, 
    p.name AS name, 
    COALESCE(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'id', s.id, 
          'type', s.type
        )
      ) FILTER (WHERE s.id IS NOT NULL), 
      '{}'::json[]
    ) AS sensors 
  FROM points.point p 
  LEFT JOIN sensors.sensor s ON p.id = s.point_id 
  LEFT JOIN machines.machine m ON m.id = p.machine_id
  WHERE p.id = $1 
  GROUP BY p.id, m.type;
`;

exports.deletePointByIdQuery = 'DELETE FROM points.point WHERE id = $1';