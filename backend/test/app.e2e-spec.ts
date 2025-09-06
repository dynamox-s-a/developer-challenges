import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'token');
      });
    });
  });

  describe('Machine', () => {
    const createDto = {
      name: 'Compressor Z',
      type: 'Pump',
    };

    it('should create a machine', () => {
      return pactum
        .spec()
        .post('/machines')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody(createDto)
        .expectStatus(201)
        .stores('machineId', 'id');
    });

    it('should get machine by id', () => {
      return pactum
        .spec()
        .get('/machines/$S{machineId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200);
    });

    it('should update the machine', () => {
      return pactum
        .spec()
        .put('/machines/$S{machineId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({ name: 'Updated Machine' })
        .expectStatus(200);
    });

    it('should delete the machine', () => {
      return pactum
        .spec()
        .delete('/machines/$S{machineId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200);
    });
  });

  describe('Monitoring Point', () => {
    it('should create a machine for point', () => {
      return pactum
        .spec()
        .post('/machines')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({ name: 'Fan X', type: 'Fan' })
        .expectStatus(201)
        .stores('machineId', 'id');
    });

    it('should create a monitoring point', () => {
      return pactum
        .spec()
        .post('/monitoring-points')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({
          name: 'Point A',
          machineId: '$S{machineId}',
        })
        .expectStatus(201)
        .stores('monitoringPointId', 'id');
    });

    it('should get monitoring point by id', () => {
      return pactum
        .spec()
        .get('/monitoring-points/$S{monitoringPointId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200);
    });

    it('should update a monitoring point', () => {
      return pactum
        .spec()
        .put('/monitoring-points/$S{monitoringPointId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({ name: 'Updated Point A' })
        .expectStatus(200);
    });

    it('should delete a monitoring point', () => {
      return pactum
        .spec()
        .delete('/monitoring-points/$S{monitoringPointId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200);
    });
  });

  describe('Sensor', () => {
    it('should create machine and point for sensor', async () => {
      await pactum
        .spec()
        .post('/machines')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({ name: 'Sensor Test Machine', type: 'Fan' })
        .expectStatus(201)
        .stores('sensorMachineId', 'id');

      await pactum
        .spec()
        .post('/monitoring-points')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({ name: 'Sensor Point', machineId: '$S{sensorMachineId}' })
        .expectStatus(201)
        .stores('sensorMonitoringPointId', 'id');
    });

    it('should create a sensor', () => {
      return pactum
        .spec()
        .post('/sensors')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({
          model: 'HFPlus',
          monitoringPointId: '$S{sensorMonitoringPointId}',
        })
        .expectStatus(201)
        .stores('sensorId', 'id');
    });

    it('should fail creating restricted sensor for Pump', async () => {
      await pactum
        .spec()
        .post('/machines')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({ name: 'Restricted Pump', type: 'Pump' })
        .expectStatus(201)
        .stores('pumpMachineId', 'id');

      await pactum
        .spec()
        .post('/monitoring-points')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({ name: 'Pump Point', machineId: '$S{pumpMachineId}' })
        .expectStatus(201)
        .stores('pumpMonitoringPointId', 'id');

      return pactum
        .spec()
        .post('/sensors')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({
          model: 'TcAg',
          monitoringPointId: '$S{pumpMonitoringPointId}',
        })
        .expectStatus(400);
    });
  });
});
