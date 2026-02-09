import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TelemetryGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('TelemetryGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  broadcastTelemetry(payload: any) {
    this.server.emit('telemetry_update', payload);
  }

  broadcastTotalTelemetry(payload: { totalTelemetry: number }) {
    this.server.emit('telemetry_count_update', payload);
  }

  broadcastMachinesCount(payload: { machinesCount: number }) {
    this.server.emit('machines_count_update', payload);
  }

  broadcastMonitoringPointsCount(payload: { monitoringPointsCount: number }) {
    this.server.emit('monitoring_points_count_update', payload);
  }

  broadcastActiveSensorsCount(payload: { activeSensorsCount: number }) {
    this.server.emit('active_sensors_count_update', payload);
  }
}
