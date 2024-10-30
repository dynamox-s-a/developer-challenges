import axios from 'axios';

const API_BASE = '/api';
let accessToken: string;
let testMachineId1: string;
let testMachineId2: string;

describe('User Authentication', () => {
  const userCredentials = {
    email: 'test12@example.com',
    password: '12345678',
  };

  it('should handle user signup (new or existing)', async () => {
    try {
      const res = await axios.post(`${API_BASE}/user`, userCredentials);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.email).toBe(userCredentials.email);
    } catch (error: any) {
      // If user already exists (409 Conflict), that's okay
      if (error.response?.status !== 409) {
        console.error('Unexpected Signup Error:', error.response?.data);
        throw error;
      }
      console.log('User already exists, proceeding with login');
    }
  });

  it('should login an existing user and receive a JWT token', async () => {
    const res = await axios.post(`${API_BASE}/auth/login`, userCredentials);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('access_token');
    accessToken = res.data.access_token;
  });
});

describe('Machines Management', () => {
  const machineData1 = {
    name: 'Machine B1',
    type: 'Fan',
  };

  const machineData2 = {
    name: 'Machine B2',
    type: 'Pump',
  };

  beforeAll(async () => {
    if (!accessToken) {
      const userCredentials = {
        email: 'test1@example.com',
        password: '12345678',
      };
      const res = await axios.post(`${API_BASE}/auth/login`, userCredentials);
      accessToken = res.data.access_token;
    }

    const res1 = await axios.post(`${API_BASE}/machines`, machineData1, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res1.status).toBe(201);
    expect(res1.data).toHaveProperty('id');
    expect(res1.data.name).toBe(machineData1.name);
    expect(res1.data.type).toBe(machineData1.type);
    testMachineId1 = res1.data.id;

    const res2 = await axios.post(`${API_BASE}/machines`, machineData2, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res2.status).toBe(201);
    expect(res2.data).toHaveProperty('id');
    expect(res2.data.name).toBe(machineData2.name);
    expect(res2.data.type).toBe(machineData2.type);
    testMachineId2 = res2.data.id;
  });

  it('should retrieve all machines', async () => {
    const res = await axios.get(`${API_BASE}/machines`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should retrieve a specific machine by ID (Machine 1)', async () => {
    const res = await axios.get(`${API_BASE}/machines/${testMachineId1}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id', testMachineId1);
    expect(res.data).toHaveProperty('name', machineData1.name);
    expect(res.data).toHaveProperty('type', machineData1.type);
  });

  it('should retrieve a specific machine by ID (Machine 2)', async () => {
    const res = await axios.get(`${API_BASE}/machines/${testMachineId2}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id', testMachineId2);
    expect(res.data).toHaveProperty('name', machineData2.name);
    expect(res.data).toHaveProperty('type', machineData2.type);
  });

  it('should update Machine 2', async () => {
    const updatedData = {
      name: 'Machine C2',
      type: 'Pump',
    };

    const res = await axios.patch(
      `${API_BASE}/machines/${testMachineId2}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id', testMachineId2);
    expect(res.data.name).toBe(updatedData.name);
    expect(res.data.type).toBe(updatedData.type);
  });

  it('should delete Machine 1', async () => {
    const res = await axios.delete(`${API_BASE}/machines/${testMachineId1}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(204);
  });
});

describe('Machine Type Constraints', () => {
  const validMachineTypes = ['Fan', 'Pump'];

  it('should allow creating a machine of type Fan', async () => {
    const machineData = {
      name: 'Fan Machine',
      type: 'Fan',
    };

    const res = await axios.post(`${API_BASE}/machines`, machineData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    expect(res.data.type).toBe('Fan');
  });

  it('should allow creating a machine of type Pump', async () => {
    const machineData = {
      name: 'Pump Machine',
      type: 'Pump',
    };

    const res = await axios.post(`${API_BASE}/machines`, machineData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    expect(res.data.type).toBe('Pump');
  });

  it(`should not allow creating a machine of invalid type: Motor`, async () => {
    const machineData = {
      name: 'Motor Machine',
      type: 'Motor',
    };

    try {
      await axios.post(`${API_BASE}/machines`, machineData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fail(`Machine creation should have failed for type: Motor`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('error');
    }
  });
});

describe('Monitoring Points Management', () => {
  const monitoringPointData = {
    name: 'MP for Machine ',
  };
  let monitoringPointId: string;

  it('should create a new monitoring point for Machine 2', async () => {
    const res = await axios.post(
      `${API_BASE}/machines/${testMachineId2}/monitoring-points`,
      monitoringPointData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    expect(res.data.name).toBe(monitoringPointData.name);
    monitoringPointId = res.data.id;
  });

  it('should retrieve all monitoring points (non-paginated)', async () => {
    const res = await axios.get(`${API_BASE}/monitoring-points`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThanOrEqual(1);
    expect(res.data[0]).toHaveProperty('id');
    expect(res.data[0]).toHaveProperty('name');
    expect(res.data[0]).toHaveProperty('machine');
  });

  it('should retrieve paginated monitoring points with default parameters', async () => {
    const res = await axios.get(`${API_BASE}/monitoring-points/paginated`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('data');
    expect(res.data).toHaveProperty('total');
    expect(res.data).toHaveProperty('page');
    expect(res.data).toHaveProperty('totalPages');
    expect(res.data).toHaveProperty('totalMachines');
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('should retrieve paginated monitoring points with custom parameters', async () => {
    const res = await axios.get(`${API_BASE}/monitoring-points/paginated`, {
      params: {
        page: 1,
        sortBy: 'machine_name',
        sortOrder: 'desc',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('data');
    expect(res.data).toHaveProperty('total');
    expect(res.data).toHaveProperty('page', 1);
    expect(res.data).toHaveProperty('totalPages');
    expect(res.data).toHaveProperty('totalMachines');
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('should delete the monitoring point for Machine 2', async () => {
    const res = await axios.delete(
      `${API_BASE}/machines/${testMachineId2}/monitoring-points/${monitoringPointId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(res.status).toBe(204);
  });
});

describe('Sensors Management', () => {
  const validSensorPump = { model: 'HFPlus' };
  const invalidSensorPump = { model: 'InvalidModelPump' };

  const validSensorsFan = [
    { model: 'HFPlus' },
    { model: 'TcAg' },
    { model: 'TcAs' },
  ];
  const invalidSensorFan = { model: 'InvalidModelFan' };

  let pumpMonitoringPointId: string;
  let fanMachineId: string;
  let fanMonitoringPointId: string;

  beforeAll(async () => {
    if (!accessToken) {
      const userCredentials = {
        email: 'test1@example.com',
        password: '12345678',
      };
      const res = await axios.post(`${API_BASE}/auth/login`, userCredentials);
      accessToken = res.data.access_token;
    }

    if (!testMachineId2) {
      const machineDataPump = {
        name: 'Pump Machine for Sensors',
        type: 'Pump',
      };
      const resPump = await axios.post(
        `${API_BASE}/machines`,
        machineDataPump,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      expect(resPump.status).toBe(201);
      testMachineId2 = resPump.data.id;
    }

    const resMonitoringPump = await axios.post(
      `${API_BASE}/machines/${testMachineId2}/monitoring-points`,
      { name: 'Pump Monitoring Point for Sensors' },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    expect(resMonitoringPump.status).toBe(201);
    pumpMonitoringPointId = resMonitoringPump.data.id;

    const machineDataFan = {
      name: 'Fan Machine for Sensors',
      type: 'Fan',
    };
    const resFan = await axios.post(`${API_BASE}/machines`, machineDataFan, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(resFan.status).toBe(201);
    fanMachineId = resFan.data.id;

    const resMonitoringFan = await axios.post(
      `${API_BASE}/machines/${fanMachineId}/monitoring-points`,
      { name: 'Fan Monitoring Point for Sensors' },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    expect(resMonitoringFan.status).toBe(201);
    fanMonitoringPointId = resMonitoringFan.data.id;
  });

  afterAll(async () => {
    await axios.delete(
      `${API_BASE}/machines/${testMachineId2}/monitoring-points/${pumpMonitoringPointId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    await axios.delete(
      `${API_BASE}/machines/${fanMachineId}/monitoring-points/${fanMonitoringPointId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    await axios.delete(`${API_BASE}/machines/${testMachineId2}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    await axios.delete(`${API_BASE}/machines/${fanMachineId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });

  describe('Pump Machine Sensors', () => {
    it('should allow adding a valid sensor (HFPlus) to a Pump machine', async () => {
      const res = await axios.post(
        `${API_BASE}/monitoring-points/${pumpMonitoringPointId}/sensor`,
        validSensorPump,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.model).toBe(validSensorPump.model);
    });

    it('should reject adding an invalid sensor to a Pump machine', async () => {
      try {
        await axios.post(
          `${API_BASE}/monitoring-points/${pumpMonitoringPointId}/sensor`,
          invalidSensorPump,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        fail(
          'Sensor creation should have failed for Pump machine with invalid model'
        );
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });
  });

  describe('Fan Machine Sensors', () => {
    validSensorsFan.forEach((sensor) => {
      it(`should allow adding a valid sensor (${sensor.model}) to a Fan machine`, async () => {
        const res = await axios.post(
          `${API_BASE}/monitoring-points/${fanMonitoringPointId}/sensor`,
          sensor,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty('id');
        expect(res.data.model).toBe(sensor.model);
      });
    });

    it('should reject adding an invalid sensor to a Fan machine', async () => {
      try {
        await axios.post(
          `${API_BASE}/monitoring-points/${fanMonitoringPointId}/sensor`,
          invalidSensorFan,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        fail(
          'Sensor creation should have failed for Fan machine with invalid model'
        );
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });
  });
});
